import {CardsPerRow} from '../const';
import {render, unrender} from '../util';
import {Sort} from '../components/sort';
import {Films} from '../components/films';
import {FilmList} from '../components/film-list';
import {FilmListController} from '../controllers/film-list';
import {ShowMore} from '../components/show-more';

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
    this._filmListController = new FilmListController(this._board.getElement(), this._films);
    this._showMore = new ShowMore();
  }

  _renderCardsRow(films, listEl, cardsPerRow, isAdded = true, isContinues = true) {
    const finishIndex = (isContinues) ? this._filmsRendered + cardsPerRow : cardsPerRow;
    const quantity = (isContinues) ? this._filmsRendered : 0;

    for (let i = quantity; i < finishIndex && i < films.length; i++) {
      this._filmListController.renderCard(listEl, films[i]);

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
      const filmsListContainerEl = this._mainList
        .getElement()
        .querySelector(`.films-list__container`);
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

      this._renderCardsRow(this._filmsToRender, this._mainList.getElement(), CardsPerRow.MAIN, true, false);

      if (isNewLink) {
        activeLinkEl.classList.remove(activeLinkCls);
        evt.target.classList.add(activeLinkCls);
      }
    }
  }

  show() {
    this._board
      .getElement()
      .classList.remove(`visually-hidden`);
  }

  hide() {
    this._board
      .getElement()
      .classList.add(`visually-hidden`);
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
