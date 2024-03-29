import MovieController from './movie';

class FilmListController {
  constructor(container, films, onDataMainChange, onCommentsUpdate) {
    this._container = container;
    this._films = films;
    this._onDataMainChange = onDataMainChange;
    this._onCommentsUpdate = onCommentsUpdate;
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._subscriptions = [];
  }

  _onDataChange(newData, oldData, action = `update`) {
    const filmIndex = this._films.findIndex((movie) => movie.id === oldData.id);
    let deleted = null;

    if (action === `delete`) {
      deleted = oldData.comments.find((comment) => !newData.comments.includes(comment));
    }

    this._onDataMainChange(action, newData, this._updateCard.bind(this, filmIndex), deleted);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _updateCard(filmIndex, newData, action) {
    const filmId = this._films[filmIndex].id;
    const lists = [
      this._container.querySelector(`.films-list`),
      ...this._container.querySelectorAll(`.films-list--extra`)
    ];

    this._films[filmIndex] = newData;

    lists.forEach((list) => {
      const elements = list.querySelector(`.films-list__container`).children;

      for (let element of elements) {
        if (element.dataset.id === filmId) {
          const index = [...elements].indexOf(element);
          const film = this._films.find((movie) => movie.id === filmId);

          this.renderCard(list, film, index, true);
          break;
        }
      }
    });

    if (action === `post` || action === `delete`) {
      this._onCommentsUpdate(this._films);
    }
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

export default FilmListController;
