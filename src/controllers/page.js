import {cloneDeep} from 'lodash';
import {CardsPerRow} from '../const';
import {render, unrender} from '../util';
import Sort from '../components/sort';
import Films from '../components/films';
import FilmList from '../components/film-list';
import FilmListController from '../controllers/film-list';
import ShowMore from '../components/show-more';

class PageController {
  constructor(container, onDataChange) {
    this._container = container;
    this._films = null;
    this._onDataChange = onDataChange;
    this._filmsToRender = null;
    this._filmsRendered = 0;
    this._sortedByComments = null;
    this._sortedByRating = null;
    this._sort = new Sort();
    this._board = new Films();
    this._mainList = null;
    this._topList = null;
    this._bandyList = null;
    this._filmListController = null;
    this._showMore = new ShowMore();
    this._onCommentsUpdate = this._onCommentsUpdate.bind(this);
  }

  _renderCardsRow(films, listEl, cardsPerRow, isAdded = true, isContinues = false) {
    const mainListEl = this._mainList.getElement();
    const showMoreEl = this._showMore.getElement();
    const startIndex = (isContinues) ? this._filmsRendered : 0;
    const finishIndex = (isContinues) ? this._filmsRendered + cardsPerRow : cardsPerRow;

    for (let i = startIndex; i < finishIndex && i < films.length; i++) {
      this._filmListController.renderCard(listEl, films[i]);

      if (isAdded) {
        this._filmsRendered++;
      }
    }

    const isFinish = this._filmsRendered >= films.length;
    const isShowMoreExists = mainListEl.contains(showMoreEl);

    if (isFinish) {
      unrender(showMoreEl);
    } else if (!isFinish && !isShowMoreExists) {
      render(mainListEl, showMoreEl);
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    const type = evt.target.dataset.type;
    const activeLinkCls = `sort__button--active`;

    if (type) {
      const filmsCopy = cloneDeep(this._films);
      const activeLinkEl = this._sort
        .getElement()
        .querySelector(`.${activeLinkCls}`);
      const isNewLink = activeLinkEl !== evt.target;
      const mainListEl = this._mainList.getElement();

      this._filmsRendered = 0;
      mainListEl.querySelector(`.films-list__container`).innerHTML = ``;

      switch (type) {
        case `default`:
          this._filmsToRender = filmsCopy;
          break;
        case `date`:
          this._filmsToRender = filmsCopy.sort((filmA, filmB) => filmB.release - filmA.release);
          break;
        case `rating`:
          this._filmsToRender = filmsCopy.sort((filmA, filmB) => filmB.rate - filmA.rate);
          break;
      }

      this._renderCardsRow(this._filmsToRender, mainListEl, CardsPerRow.MAIN);

      if (isNewLink) {
        activeLinkEl.classList.remove(activeLinkCls);
        evt.target.classList.add(activeLinkCls);
      }
    }
  }

  _onCommentsUpdate(films) {
    const bandyListEl = this._bandyList.getElement();

    this._films = films;
    this._filmsToRender = films;
    this._sortedByComments = cloneDeep(films).sort((filmsA, filmsB) => filmsB.comments.length - filmsA.comments.length);

    bandyListEl.querySelector(`.films-list__container`).innerHTML = ``;
    this._renderCardsRow(this._sortedByComments, bandyListEl, CardsPerRow.EXTRA, false);
  }

  update(films) {
    this._films = films;
    this._filmsToRender = films;
    this._sortedByComments = cloneDeep(films).sort((filmsA, filmsB) => filmsB.comments.length - filmsA.comments.length);
    this._sortedByRating = cloneDeep(films).sort((filmsA, filmsB) => filmsB.rate - filmsA.rate);
    this._mainList = new FilmList(`All movies. Upcoming`, this._films);
    this._topList = new FilmList(`Top rated`, this._sortedByRating, true);
    this._bandyList = new FilmList(`Most commented`, this._sortedByComments, true);
    this._filmListController = new FilmListController(this._board.getElement(), this._films, this._onDataChange, this._onCommentsUpdate);
    this.init();
  }

  show(films) {
    const oldList = this._mainList.getElement();

    this._films = films;
    this._filmsToRender = films;
    this._mainList = new FilmList(`All movies. Upcoming`, this._filmsToRender);
    this._filmListController = new FilmListController(this._board.getElement(), this._filmsToRender, this._onDataChange, this._onCommentsUpdate);
    this._filmsRendered = 0;
    this._renderCardsRow(this._filmsToRender, this._mainList.getElement(), CardsPerRow.MAIN);
    oldList.replaceWith(this._mainList.getElement());
    render(this._container, this._sort.getElement());
    render(this._container, this._board.getElement());
  }

  hide() {
    unrender(this._sort.getElement());
    unrender(this._board.getElement());
  }

  init() {
    const filmsEl = this._board.getElement();

    filmsEl.innerHTML = ``;

    if (this._films) {
      const mainListEl = this._mainList.getElement();
      const topListEl = this._topList.getElement();
      const bandyListEl = this._bandyList.getElement();
      const showMoreEl = this._showMore.getElement();
      const isMultiRow = this._filmsToRender.length > CardsPerRow.MAIN;

      this._renderCardsRow(this._films, mainListEl, CardsPerRow.MAIN);

      if (isMultiRow) {
        showMoreEl.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this._renderCardsRow(this._filmsToRender, this._mainList.getElement(), CardsPerRow.MAIN, true, true);
        });

        render(mainListEl, showMoreEl);
      }

      this._sort
        .getElement()
        .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

      render(this._container, this._sort.getElement());
      this._renderCardsRow(this._sortedByRating, topListEl, CardsPerRow.EXTRA, false);
      this._renderCardsRow(this._sortedByComments, bandyListEl, CardsPerRow.EXTRA, false);
      render(filmsEl, mainListEl);
      render(filmsEl, topListEl);
      render(filmsEl, bandyListEl);
    } else {
      filmsEl.innerHTML = `<p>Loading…</p>`;
    }

    render(this._container, filmsEl);
  }
}

export default PageController;
