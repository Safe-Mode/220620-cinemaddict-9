// import {cloneDeep} from 'lodash';
import {MovieController} from './movie';

class FilmListController {
  constructor(container, films, onDataMainChange) {
    this._container = container;
    this._films = films;
    this._onDataMainChange = onDataMainChange;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
  }

  _onDataChange(newData, oldData, action = `update`) {
    const filmIndex = this._films.findIndex((movie) => movie === oldData);
    const lists = [
      ...this._container.querySelectorAll(`.films-list`),
      ...this._container.querySelectorAll(`.films-list--extra`)
    ];

    // this._films[filmIndex] = cloneDeep(newData);

    lists.forEach((list) => {
      if (filmIndex >= 0 && filmIndex < list.querySelector(`.films-list__container`).children.length) {
        this._onDataMainChange(action, newData, this._updateCard.bind(this, list, filmIndex));
      }
    });
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _updateCard(list, filmIndex, newData) {
    this._films[filmIndex] = newData;
    this.renderCard(list, this._films[filmIndex], filmIndex, true);
  }

  renderCard(listEl, film, position, openPopup) {
    const movie = new MovieController(listEl, film, this._onDataChange, this._onChangeView, position, this._onDataMainChange);
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
