import ModelMovie from './models/movie';
import ModelComment from './models/comment';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

class Provider {
  constructor({api, movieStore, commentStore}) {
    this._api = api;
    this._movieStore = movieStore;
    this._commentStore = commentStore;
  }

  static isOnline() {
    return window.navigator.onLine;
  }

  getMovies() {
    if (Provider.isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.map((movie) => this._movieStore.setItem({
            key: movie.id,
            item: movie.toRAW(),
          }));

          return movies;
        });
    } else {
      const rawMoviesMap = this._movieStore.getAll();
      const rawMovies = objectToArray(rawMoviesMap);
      const movies = ModelMovie.parseMovies(rawMovies);

      return Promise.resolve(movies);
    }
  }

  updateMovie({id, data}) {
    if (Provider.isOnline()) {
      return this._api.updateMovie({id, data})
        .then((movie) => {
          this._movieStore.setItem({
            key: movie.id,
            item: movie.toRAW(),
          });

          return movie;
        });
    } else {
      const movie = data;
      this._movieStore.setItem({
        key: movie.id,
        item: movie,
      });
      return Promise.resolve(ModelMovie.parseMovie(movie));
    }
  }

  getComments(id) {
    if (Provider.isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          comments.map((comment) => this._commentStore.setItem({
            key: comment.id,
            item: comment.toRAW(),
          }));

          return comments;
        });
    } else {
      const rawMoviesMap = this._movieStore.getAll();
      const rawMovies = objectToArray(rawMoviesMap);
      const movies = ModelMovie.parseMovies(rawMovies);
      const rawCommentsMap = this._commentStore.getAll();
      const rawComments = objectToArray(rawCommentsMap);
      const comments = ModelComment
        .parseComments(rawComments)
        .filter((comment) => movies[id].comments.includes(comment.id));

      return Promise.resolve(comments);
    }
  }

  syncMovies() {
    return this._api.syncMovies({
      movies: objectToArray(this._movieStore.getAll()),
    });
  }
}

export default Provider;
