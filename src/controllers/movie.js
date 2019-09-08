import {render, unrender, isEscPressed} from '../util';
import {Film} from '../components/film';
import {FilmDetails} from '../components/film-details';

class MovieController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._film = new Film(this._data);
    this._details = new FilmDetails(this._data);
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

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        closePopup(this._details);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCloseBtnClick = (closeEvt) => {
      closeEvt.preventDefault();

      if (closeEvt.target.classList.contains(`film-details__close-btn`)) {
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
      }
    };

    const renderFilmCard = () => {
      const filmsListContainerEl = this._container.querySelector(`.films-list__container`);
      const filmCardEl = this._film.getElement();

      filmCardEl.addEventListener(`click`, onCardTogglerClick);
      render(filmsListContainerEl, filmCardEl);
    };

    renderFilmCard();
  }
}

export {MovieController};
