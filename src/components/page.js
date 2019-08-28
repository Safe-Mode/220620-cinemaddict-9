import {CardsPerRow} from '../const';
import {render, unrender, isEscPressed} from '../util';
import {Films} from './films';
import {FilmList} from './film-list';
import {Film} from './film';
import {FilmDetails} from './film-details';
import {ShowMore} from './show-more';

class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
  }

  _renderFilmCard(film, filmsListEl) {
    const bodyEl = document.querySelector(`body`);
    const filmsListContainerEl = filmsListEl.querySelector(`.films-list__container`);
    const filmCard = new Film(film);
    const filmDetails = new FilmDetails(film);
    const filmCardEl = filmCard.getElement();

    const openPopup = (popup) => {
      render(bodyEl, popup.getElement());
      bodyEl.classList.add(`hide-overflow`);
    };

    const closePopup = (popup) => {
      unrender(popup.getElement());
      popup.removeElement();
      bodyEl.classList.remove(`hide-overflow`);
    };

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        closePopup(filmDetails);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCloseBtnClick = (closeEvt) => {
      closeEvt.preventDefault();

      if (closeEvt.target.classList.contains(`film-details__close-btn`)) {
        closePopup(filmDetails);
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
        const filmDetailsEl = filmDetails.getElement();

        openPopup(filmDetails);

        document.addEventListener(`keydown`, onEscKeydown);
        filmDetailsEl.addEventListener(`click`, onCloseBtnClick);

        filmDetailsEl
              .querySelector(`.film-details__comment-input`)
              .addEventListener(`focus`, onCommentFocus);
      }
    };

    filmCardEl.addEventListener(`click`, onCardTogglerClick);
    render(filmsListContainerEl, filmCardEl);
  }

  init() {
    const filmsEl = new Films().getElement();
    const mainListEl = new FilmList(`All movies. Upcoming`, this._films).getElement();
    const topListEl = new FilmList(`Top rated`, this._films, true).getElement();
    const bandyListEl = new FilmList(`Most commented`, this._films, true).getElement();
    const showMore = new ShowMore();
    const showMoreEl = showMore.getElement();

    const renderFilmCardsRow = (listEl, cardsPerRow, row = 1) => {
      const startIndex = (row - 1) * cardsPerRow;
      const finishIndex = row * cardsPerRow - 1;

      for (let i = startIndex; i <= finishIndex && i < this._films.length; i++) {
        this._renderFilmCard(this._films[i], listEl);
      }

      if (row * cardsPerRow >= this._films.length) {
        unrender(showMoreEl);
        showMore.removeElement();
      }

      return ++row;
    };

    let rowMain = renderFilmCardsRow(mainListEl, CardsPerRow.MAIN);

    if (this._films.length) {
      showMoreEl.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        rowMain = renderFilmCardsRow(mainListEl, CardsPerRow.MAIN, rowMain);
      });

      render(mainListEl, showMoreEl);
    }

    renderFilmCardsRow(topListEl, CardsPerRow.EXTRA);
    renderFilmCardsRow(bandyListEl, CardsPerRow.EXTRA);
    render(filmsEl, mainListEl);
    render(filmsEl, topListEl);
    render(filmsEl, bandyListEl);
    render(this._container, filmsEl);
  }
}

export {PageController};
