import {render} from '../util';
import {Films} from '../components/films';
import {FilmList} from '../components/film-list';
import {SearchResult} from './../components/search-result';
import {FilmListController} from './../controllers/film-list';

class SearchController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._board = new Films();
    this._filmList = new FilmList(`All movies. Upcoming`, this._films);
    this._searchResult = new SearchResult(this._films.length);
    this._filmListController = new FilmListController(this._board.getElement(), this._films);
  }

  show() {
    this._container = ``;
    render(this._container, this._searchResult.getElement());
    render(this._container, this._board.getElement());
  }

  hide() {
    this._searchResult
      .getElement()
      .classList.add(`visually-hidden`);
  }

  init() {
    const filmListEl = this._mainList.getElement();

    this._films.forEach((film) => {
      this._filmListController.render(filmListEl, film);
    });

    render(this._board.getElement(), filmListEl);
  }
}

export {SearchController};
