import {CardsPerRow} from '../const';
import {render, unrender, isEscPressed} from '../util';
import {Sort} from './sort';
import {Films} from './films';
import {FilmList} from './film-list';
import {Film} from './film';
import {FilmDetails} from './film-details';
import {ShowMore} from './show-more';

class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._filmsToRender = films;
    this._filmsRendered = 0;
    this._sortEl = new Sort().getElement();
    this._mainListEl = new FilmList(`All movies. Upcoming`, this._films).getElement();
    this._showMore = new ShowMore();
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

  _renderCardsRow(films, listEl, cardsPerRow, isAdded = true, isContinues = true) {
    const quantity = this._filmsRendered;
    const finishIndex = (isContinues) ? quantity + cardsPerRow : quantity;

    this._filmsRendered = (isContinues) ? this._filmsRendered : 0;

    for (let i = this._filmsRendered; i < finishIndex && i < films.length; i++) {
      this._renderFilmCard(films[i], listEl);

      if (isAdded) {
        this._filmsRendered++;
      }
    }

    const isFinish = this._filmsRendered >= films.length;

    if (isFinish) {
      unrender(this._showMore.getElement());
      this._showMore.removeElement();
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    const type = evt.target.dataset.type;
    const activeLinkCls = `sort__button--active`;

    if (type) {
      const filmsCopy = this._films.slice();
      const activeLinkEl = this._sortEl.querySelector(`.${activeLinkCls}`);
      const filmsListContainerEl = this._mainListEl.querySelector(`.films-list__container`);
      const isNewLink = activeLinkEl !== evt.target;
      filmsListContainerEl.innerHTML = ``;

      switch (type) {
        case `default`:
          this._filmsToRender = this._films;
          break;
        case `date`:
          this._filmsToRender = filmsCopy.sort((filmA, filmB) => filmB.release - filmA.release);
          break;
        case `rating`:
          this._filmsToRender = filmsCopy.sort((filmA, filmB) => filmB.rate - filmA.rate);
          break;
      }

      this._renderCardsRow(this._filmsToRender, this._mainListEl, CardsPerRow.MAIN, true, false);

      if (isNewLink) {
        activeLinkEl.classList.remove(activeLinkCls);
        evt.target.classList.add(activeLinkCls);
      }
    }
  }

  init() {
    const filmsEl = new Films().getElement();
    const topListEl = new FilmList(`Top rated`, this._films, true).getElement();
    const bandyListEl = new FilmList(`Most commented`, this._films, true).getElement();
    const showMoreEl = this._showMore.getElement();
    const isMultiRow = this._filmsToRender.length > CardsPerRow.MAIN;

    this._renderCardsRow(this._films, this._mainListEl, CardsPerRow.MAIN);

    if (isMultiRow) {
      showMoreEl.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._renderCardsRow(this._filmsToRender, this._mainListEl, CardsPerRow.MAIN);
      });

      render(this._mainListEl, showMoreEl);
    }

    this._sortEl.addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    render(this._container, this._sortEl);
    this._renderCardsRow(this._filmsToRender, topListEl, CardsPerRow.EXTRA, false);
    this._renderCardsRow(this._filmsToRender, bandyListEl, CardsPerRow.EXTRA, false);
    render(filmsEl, this._mainListEl);
    render(filmsEl, topListEl);
    render(filmsEl, bandyListEl);
    render(this._container, filmsEl);
  }
}

export {PageController};
