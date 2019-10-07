import {render, unrender} from '../util';
import Films from '../components/films';
import FilmList from '../components/film-list';
import SearchResult from './../components/search-result';
import FilmListController from './../controllers/film-list';

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
    render(this._container, this._searchResult.getElement());
    render(this._container, this._board.getElement());
  }

  hide() {
    unrender(this._searchResult.getElement());
    unrender(this._board.getElement());
  }

  init() {
    const filmListEl = this._filmList.getElement();
    const searchResultEl = this._searchResult.getElement();
    const boardEl = this._board.getElement();

    if (this._container.contains(searchResultEl)) {
      searchResultEl.remove();
      this._searchResult.removeElement();
      boardEl.remove();
      this._board.removeElement();
    }

    this._films.forEach((film) => {
      this._filmListController.renderCard(this._filmList.getElement(), film);
    });

    render(this._container, searchResultEl);
    render(this._container, boardEl);
    render(boardEl, filmListEl);
  }
}

export default SearchController;
