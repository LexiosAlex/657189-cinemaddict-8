import ModelMovie from './model-movie.js';
import {METHOD} from './export-const.js';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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
    movies.map((it) => {
      return this._load({
        url: `movies/${it.id}`,
        method: METHOD.PUT,
        body: JSON.stringify(it),
        headers: new Headers({'Content-Type': `application/json`})
      })
      .then(toJSON);
    });
  }

  toJSON(response) {
    return response.json();
  }

  getMovie() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelMovie.parseMovies);
  }

  updateMovie({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: METHOD.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelMovie.parseMovie);
  }

  _load({url, method = METHOD.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
