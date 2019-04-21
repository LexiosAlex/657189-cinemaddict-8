import ModelMovie from './model-movie.js';
import {Method} from './export-const.js';

const SUCCESS_STATUS = 200;
const UNSUCESS_STATUS = 300;

const checkStatus = (response) => {
  if (response.status >= SUCCESS_STATUS && response.status < UNSUCESS_STATUS) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};


export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  syncMovies({movies}) {
    movies.forEach((it) => {
      return this._load({
        url: `movies/${it.id}`,
        method: Method.PUT,
        body: JSON.stringify(it),
        headers: new Headers({'Content-Type': `application/json`})
      })
      .then(toJSON);
    });
  }

  getMovie() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelMovie.parseMovies);
  }

  updateMovie({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelMovie.parseMovie);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
