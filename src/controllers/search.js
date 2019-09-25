import {render} from '../util';
import {Films} from '../components/films';
import {FilmList} from '../components/film-list';
import {SearchResult} from './../components/search-result';
import {FilmListController} from './../controllers/film-list';

class SearchController {
  constructor(container, films, search) {
    this._container = container;
    this._films = films;
    this._search = search;
    this._count = this._films.length;
    this._board = new Films();
    this._filmList = new FilmList(`All movies. Upcoming`, this._films);
    this._searchResult = new SearchResult(this._count);
    this._filmListController = new FilmListController(this._board.getElement(), this._films);
  }

  show() {
    this._searchResult
      .getElement()
      .classList.remove(`visually-hidden`);
    this._board
      .getElement()
      .classList.remove(`visually-hidden`);
  }

  hide() {
    this._searchResult
      .getElement()
      .classList.add(`visually-hidden`);
    this._board
      .getElement()
      .classList.add(`visually-hidden`);
  }

  init() {
    const filmListEl = this._filmList.getElement();

    // if (this._count) {
    //   this._container.innerHTML = ``;
    // }

    this._films.forEach((film) => {
      this._filmListController.renderCard(this._filmList.getElement(), film);
    });

    render(this._container, this._searchResult.getElement());
    render(this._container, this._board.getElement());
    render(this._board.getElement(), filmListEl);
  }
}

export {SearchController};
