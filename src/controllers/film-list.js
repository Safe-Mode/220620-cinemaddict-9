import {cloneDeep} from 'lodash';
import {MovieController} from './movie';

class FilmListController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
  }

  _onDataChange(newData, oldData) {
    const filmIndex = this._films.findIndex((movie) => movie === oldData);
    const lists = [
      ...this._container.querySelectorAll(`.films-list`),
      ...this._container.querySelectorAll(`.films-list--extra`)
    ];

    this._films[filmIndex] = cloneDeep(newData);

    lists.forEach((list) => {
      if (filmIndex >= 0 && filmIndex < list.querySelector(`.films-list__container`).children.length) {
        this.renderCard(list, this._films[filmIndex], filmIndex, true);
      }
    });
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  renderCard(listEl, film, position, openPopup) {
    const movie = new MovieController(listEl, film, this._onDataChange, this._onChangeView, position);
    const filmEl = movie.init();
    const elementIndex = [...document.querySelectorAll(`.film-card`)].indexOf(filmEl);

    if (openPopup && document.querySelector(`.film-details`)) {
      movie.openPopup();
    }

    if (this._subscriptions[elementIndex]) {
      this._subscriptions[elementIndex] = movie.setDefaultView.bind(movie);
    } else {
      this._subscriptions.push(movie.setDefaultView.bind(movie));
    }
  }
}

export {FilmListController};
