import {cloneDeep} from 'lodash';
import {render, unrender, isEscPressed, isEnterPressed} from '../util';
import {Film} from '../components/film';
import {FilmDetails} from '../components/film-details';

class MovieController {
  constructor(container, data, onDataChange, onChangeView, position) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._film = new Film(data);
    this._details = new FilmDetails(data);
    this._tmpData = null;
    this._position = position;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
  }

  _initTmpData() {
    this._tmpData = cloneDeep(this._data);
  }

  _resetTmpData() {
    this._tmpData = null;
  }

  _toggleBodyScroll() {
    const overflowCls = `hide-overflow`;
    const clsMethod = (document.body.classList.contains(overflowCls)) ? `remove` : `add`;
    document.body.classList[clsMethod](overflowCls);
  }

  _setListeners() {
    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        this.setDefaultView();
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCloseBtnClick = (closeEvt) => {
      if (closeEvt.target.classList.contains(`film-details__close-btn`)) {
        closeEvt.preventDefault();
        this.setDefaultView();
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
      this._initTmpData();

      if (evt.target.name === `watched`) {
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
          name: `Anonymous`, // delete after 8
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

    const onDeleteCommentClick = (evt) => {
      evt.preventDefault();

      this._initTmpData();

      const commentIndex = [...this._details
        .getElement()
        .querySelectorAll(`.film-details__comment`)]
        .indexOf(evt.target.closest(`li`));

      this._tmpData.comments.splice(commentIndex, 1);
      this._onDataChange(this._tmpData, this._data);
      this._resetTmpData();
    };

    const filmDetailsEl = this._details.getElement();
    const filmUserRateEl = filmDetailsEl.querySelector(`.film-details__user-rating-score`);

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

    filmDetailsEl
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((delBtn) => delBtn.addEventListener(`click`, onDeleteCommentClick));

    if (filmUserRateEl) {
      filmUserRateEl.addEventListener(`input`, onRatingInput);
    }
  }

  openPopup() {
    this._onChangeView();
    this._setListeners();
    render(document.body, this._details.getElement());
    this._toggleBodyScroll();
  }

  setDefaultView() {
    if (document.body.contains(this._details.getElement())) {
      unrender(this._details.getElement());
      this._details.removeElement();
      this._toggleBodyScroll();
    }
  }

  init() {
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

        this._onDataChange(this._tmpData, this._data);
        this._resetTmpData();
      }
    };

    const onCardTogglerClick = (evt) => {
      evt.preventDefault();

      const togglers = [`film-card__poster`, `film-card__title`, `film-card__comments`];
      const isToggler = togglers.some((cls) => evt.target.classList.contains(cls));

      if (isToggler) {
        this.openPopup();
      }
    };

    const filmsListContainerEl = this._container.querySelector(`.films-list__container`);
    const filmCardEl = this._film.getElement();
    const filmControlsEl = filmCardEl.querySelector(`.film-card__controls`);

    filmControlsEl.addEventListener(`click`, onFilmControlClick);
    filmCardEl.addEventListener(`click`, onCardTogglerClick);
    render(filmsListContainerEl, filmCardEl, this._position);

    return this._film.getElement();
  }
}

export {MovieController};
