import {render, unrender, isEscPressed, isEnterPressed} from '../util';
import {Film} from '../components/film';
import {FilmDetails} from '../components/film-details';

class MovieController {
  constructor(container, data, onDataChange, onChangeView, position) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._film = new Film(this._data);
    this._details = new FilmDetails(this._data);
    this._tmpData = null;
    this._position = position;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
  }

  _initTmpData() {
    this._tmpData = Object.assign({}, this._data);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  init() {
    const toggleBodyScroll = () => {
      const bodyEl = document.querySelector(`body`);
      const overflowCls = `hide-overflow`;
      const clsMethod = (bodyEl.classList.contains(overflowCls)) ? `remove` : `add`;
      bodyEl.classList[clsMethod](overflowCls);
    };

    const openPopup = (popup) => {
      render(this._container, popup.getElement());
      toggleBodyScroll();
    };

    const closePopup = (popup) => {
      unrender(popup.getElement());
      popup.removeElement();
      toggleBodyScroll();
    };

    const reopenPopup = () => {
      closePopup();
      openPopup();
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        closePopup(this._details);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCloseBtnClick = (closeEvt) => {
      if (closeEvt.target.classList.contains(`film-details__close-btn`)) {
        closeEvt.preventDefault();
        closePopup(this._details);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCommentBlur = () => {
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onCommentFocus = (evt) => {
      document.removeEventListener(`keydown`, onEscKeydown);
      evt.target.addEventListener(`blur`, onCommentBlur);
    };

    const onRatingInput = (evt) => {
      this._initTmpData();
      this._tmpData.user.rating = evt.target.value;
      this._onDataChange(this._tmpData, this._data);
      this._resetTmpData();
    };

    const onDetailsControlInput = (evt) => {
      const detailsEl = this._details.getElement();
      const detailsMiddleEl = detailsEl.querySelector(`.form-details__middle-container`);

      this._initTmpData();

      if (evt.target.name === `watched`) {
        if (evt.target.checked) {
          detailsEl
            .querySelector(`.form-details__top-container`)
            .insertAdjacentHTML(`afterend`, this._details.getRatingTemplate());

          const filmUserRatingEl = this._details
            .getElement()
            .querySelector(`.film-details__user-rating-score`);

          filmUserRatingEl.addEventListener(`input`, onRatingInput);
        } else {
          if (detailsEl.contains(detailsMiddleEl)) {
            unrender(detailsMiddleEl);
          }
        }

        this._tmpData.user.watched = !this._tmpData.user.watched;
        this._tmpData.user.rating = null;
      } else if (evt.target.name === `favorite`) {
        this._tmpData.user.favorite = !this._tmpData.user.favorite;
      } else if (evt.target.name === `watchlist`) {
        this._tmpData.user.watchlist = !this._tmpData.user.watchlist;
      }

      this._onDataChange(this._tmpData, this._data);
      this._resetTmpData();
    };

    const onEmojiInput = (evt) => {
      const imgMarkup = `
        <img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji">
      `;
      const emojiLabelEl = this._details
        .getElement()
        .querySelector(`.film-details__add-emoji-label`);

      emojiLabelEl.innerHTML = ``;
      emojiLabelEl.insertAdjacentHTML(`beforeend`, imgMarkup);
    };

    const onCommentEnter = (evt) => {
      if (isEnterPressed(evt.key) && evt.ctrlKey) {
        const formData = new FormData(this._details
          .getElement()
          .querySelector(`.film-details__inner`));

        const comment = {
          author: `Anonymus`, // delete after 8
          published: Date.now(),
          text: formData.get(`comment`),
          emoji: formData.get(`comment-emoji`),
        };

        this._initTmpData();
        this._tmpData.comments.push(comment);
        this._onDataChange(this._tmpData, this._data);
        this._resetTmpData();
      }
    };

    const onCardTogglerClick = (evt) => {
      evt.preventDefault();

      const togglers = [`film-card__poster`, `film-card__title`, `film-card__comments`];
      const isToggler = togglers.some((cls) => evt.target.classList.contains(cls));

      if (isToggler) {
        const filmDetailsEl = this._details.getElement();

        openPopup(this._details);

        document.addEventListener(`keydown`, onEscKeydown);
        filmDetailsEl.addEventListener(`click`, onCloseBtnClick);

        filmDetailsEl
          .querySelector(`.film-details__comment-input`)
          .addEventListener(`focus`, onCommentFocus);
        filmDetailsEl
          .querySelector(`.film-details__controls`)
          .addEventListener(`input`, onDetailsControlInput);
        filmDetailsEl
          .querySelector(`.film-details__emoji-list`)
          .addEventListener(`input`, onEmojiInput);
        filmDetailsEl
          .querySelector(`.film-details__comment-input`)
          .addEventListener(`keydown`, onCommentEnter);
      }
    };

    const onFilmControlClick = (evt) => {
      if (evt.target.classList.contains(`film-card__controls-item`)) {
        evt.preventDefault();

        this._initTmpData();

        if (evt.target.classList.contains(`film-card__controls-item--add-to-watchlist`)) {
          this._tmpData.user.watchlist = !this._tmpData.user.watchlist;
        } else if (evt.target.classList.contains(`film-card__controls-item--mark-as-watched`)) {
          this._tmpData.user.watched = !this._tmpData.user.watched;
          this._tmpData.user.rating = null;
        } else if (evt.target.classList.contains(`film-card__controls-item--favorite`)) {
          this._tmpData.user.favorite = !this._tmpData.user.favorite;
        }

        this._onDataChange(this._tmpData, this._data, evt.target.closest(`section`));
        this._resetTmpData();
      }
    };

    const filmsListContainerEl = this._container.querySelector(`.films-list__container`);
    const filmCardEl = this._film.getElement();
    const filmControlsEl = filmCardEl.querySelector(`.film-card__controls`);

    filmControlsEl.addEventListener(`click`, onFilmControlClick);
    filmCardEl.addEventListener(`click`, onCardTogglerClick);

    render(filmsListContainerEl, filmCardEl, this._position);
  }
}

export {MovieController};
