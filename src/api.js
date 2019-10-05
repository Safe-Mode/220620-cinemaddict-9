import {Status} from './const';
import {ModelMovie} from './model-movie';
import {ModelComment} from './model-comment';

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

  // createTask({task}) {
  //   return this._load({
  //     url: `tasks`,
  //     method: `POST`,
  //     body: JSON.stringify(task),
  //     headers: new Headers({'Content-Type': `application/json`}),
  //   })
  //     .then(toJSON);
  // }

  // updateTask({id, data}) {
  //   return this._load({
  //     url: `tasks/${id}`,
  //     method: `PUT`,
  //     body: JSON.stringify(data),
  //     headers: new Headers({'Content-Type': `application/json`}),
  //   })
  //     .then(toJSON);
  // }

  // deleteTask({id}) {
  //   return this._load({
  //     url: `tasks/${id}`,
  //     method: `DELETE`,
  //   });
  // }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export {API};
