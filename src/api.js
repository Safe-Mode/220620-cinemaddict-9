import {Status} from './const';
import ModelMovie from './models/movie';
import ModelComment from './models/comment';

const toJSON = (response) => {
  return response.json();
};

const checkStatus = (response) => {
  if (response.status >= Status.OK && response.status < Status.MULTI) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelMovie.parseMovies);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then(toJSON)
      .then(ModelComment.parseComments);
  }

  postComment({filmId, comment}) {
    return this._load({
      url: `comments/${filmId}`,
      method: `POST`,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(({movie: {comments}}) => comments);
  }

  updateMovie({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelMovie.parseMovie);
  }

  deleteComment({id}) {
    return this._load({
      url: `comments/${id}`,
      method: `DELETE`,
    });
  }

  syncMovies({movies}) {
    return this._load({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(movies),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
