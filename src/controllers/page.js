import {CardsPerRow} from '../const';
import {render, unrender} from '../util';
import {Sort} from '../components/sort';
import {Films} from '../components/films';
import {FilmList} from '../components/film-list';
import {ShowMore} from '../components/show-more';
import {MovieController} from './movie';

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

  _renderCardsRow(films, listEl, cardsPerRow, isAdded = true, isContinues = true) {
    const quantity = this._filmsRendered;
    const finishIndex = (isContinues) ? quantity + cardsPerRow : quantity;

    this._filmsRendered = (isContinues) ? this._filmsRendered : 0;

    for (let i = this._filmsRendered; i < finishIndex && i < films.length; i++) {
      const movie = new MovieController(listEl, films[i]);
      movie.init();

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
