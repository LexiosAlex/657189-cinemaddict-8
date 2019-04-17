import ModelMovie from './model-movie.js';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  getMovie() {
    if (this._isOnline()) {
      return this._api.getMovie()
        .then((movies) => {
          movies.forEach((it) => this._store.setItem({key: it.id, item: it.toRaw()}));
          return movies;
        });
    } else {
      const rawMoviesMap = this._store.getAll();
      const rawMovies = objectToArray(rawMoviesMap);
      const movies = ModelMovie.parseMovies(rawMovies);

      return Promise.resolve(movies);
    }
  }

  updateMovie({id, data}) {
    if (this._isOnline()) {
      return this._api.updateMovie({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRaw()});
          return film;
        });
    } else {
      const movie = data;
      this._needSync = true;
      this._store.setItem({key: movie.id, item: movie});
      return Promise.resolve(ModelMovie.parseMovie(movie));
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  syncMovies() {
    if (this._needSync) {
      return this._api.syncMovies({movies: objectToArray(this._store.getAll())});
    }
    return Promise.resolve();
  }
}
