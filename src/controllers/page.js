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
    this._board = new Films();
    this._mainList = new FilmList(`All movies. Upcoming`, this._films);
    this._topList = new FilmList(`Top rated`, this._films, true);
    this._bandyList = new FilmList(`Most commented`, this._films, true);
    this._showMore = new ShowMore();
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  _onDataChange(newData, oldData, listEl) {
    const filmIndex = this._films.indexOf(oldData);
    const restLists = [...this._board
      .getElement()
      .querySelectorAll(`section`)]
      .filter((node) => node !== listEl);

    this._films[filmIndex] = newData;
    this._renderCard(listEl, newData, filmIndex);

    restLists.forEach((list) => {
      list.querySelector(`.films-list__container`).innerHTML = ``;

      if (list.classList.contains(`films-list--extra`)) {
        this._renderCardsRow(this._filmsToRender, list, CardsPerRow.EXTRA, false, false);
      } else {
        this._renderCardsRow(this._films, list, CardsPerRow.MAIN);
      }
    });
  }

  _onChangeView() {

  }

  _renderCard(listEl, film, position) {
    const movie = new MovieController(listEl, film, this._onDataChange, this._onChangeView, position);

    movie.init();
  }

  _renderCardsRow(films, listEl, cardsPerRow, isAdded = true, isContinues = true) {
    const quantity = this._filmsRendered;
    const finishIndex = (isContinues) ? quantity + cardsPerRow : cardsPerRow;

    this._filmsRendered = (isContinues) ? this._filmsRendered : 0;

    for (let i = this._filmsRendered; i < finishIndex && i < films.length; i++) {
      this._renderCard(listEl, films[i]);

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
    const filmsEl = this._board.getElement();
    const mainListEl = this._mainList.getElement();
    const topListEl = this._topList.getElement();
    const bandyListEl = this._bandyList.getElement();
    const showMoreEl = this._showMore.getElement();
    const isMultiRow = this._filmsToRender.length > CardsPerRow.MAIN;

    this._renderCardsRow(this._films, mainListEl, CardsPerRow.MAIN);

    if (isMultiRow) {
      showMoreEl.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._renderCardsRow(this._filmsToRender, mainListEl, CardsPerRow.MAIN);
      });

      render(mainListEl, showMoreEl);
    }

    this._sortEl.addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    render(this._container, this._sortEl);
    this._renderCardsRow(this._filmsToRender, topListEl, CardsPerRow.EXTRA, false, false);
    this._renderCardsRow(this._filmsToRender, bandyListEl, CardsPerRow.EXTRA, false, false);
    render(filmsEl, mainListEl);
    render(filmsEl, topListEl);
    render(filmsEl, bandyListEl);
    render(this._container, filmsEl);
  }
}

export {PageController};
