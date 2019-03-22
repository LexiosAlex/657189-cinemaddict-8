import Component from './component.js';
import moment from 'moment';

export default class Film extends Component {
  constructor(data) {
    super();
    this._filmTitle = data.filmTitle;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genres = data.genres;
    this._poster = data.poster;
    this._description = data.description;
    this._comments = data.comments;

    this._isAlreadyWatched = data.isAlreadyWatched;
    this._isFavorite = data.isFavorite;
    this._isWatchList = data.isWatchList;

    this._element = null;
    this._onComments = null;

    this._onAddToWatchList = null;
    this._onAddToFavorite = null;
    this._onMarkAsWatched = null;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onWatchListButtonClick = this._onWatchListButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
  }

  set onAddToFavorite(fn) {
    this._onAddToFavorite = fn;
  }

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();
    this._isFavorite = !this._isFavorite;
    const FavoriteState = this._isFavorite;
    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite(FavoriteState);
    }
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  _onWatchListButtonClick(evt) {
    evt.preventDefault();
    this._isWatchList = !this._isWatchList;
    const WatchListState = this._isWatchList;
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(WatchListState);
    }
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();
    this._isAlreadyWatched = !this._isAlreadyWatched;
    const wathchedState = this._isAlreadyWatched;
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(wathchedState);
    }
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  _onCommentsButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onComments === `function` && this._onComments();
  }

  get template() {
    const parseYear = moment.unix(this._year / 1000).format(`YYYY`);

    let parsedDuration = ``;

    if (this._duration > 60) {
      parsedDuration = moment.utc(moment.duration(this._duration, `minutes`).asMilliseconds()).format(`h[h] m[m]`);
    } else {
      parsedDuration = `${this._duration}m`;
    }

    const filmCard = {};
    filmCard.filmTitle = `
      <h3 class="film-card__title">${this._filmTitle}</h3>
    `;

    filmCard.rating = `
      <p class="film-card__rating">${this._rating}</p>
    `;

    const filmInfo = {};

    filmInfo.year = `
      <span class="film-card__year">${parseYear}</span>
    `;

    filmInfo.duration = `
      <span class="film-card__duration">${parsedDuration}</span>
    `;

    filmInfo.genre = `${[...this._genres].map((genre) => `
      <span class="film-card__genre">${genre}</span>
    `).join(``)}`;

    filmCard.filmInfo = `
      <p class="film-card__info">
        ${filmInfo.year}
        ${filmInfo.duration}
        ${filmInfo.genre}
      </p>
    `;

    filmCard.poster = `
      <img src="${this._poster}" alt="" class="film-card__poster">
    `;

    filmCard.description = `
      <p class="film-card__description">
        ${this._description}
      </p>
    `;

    filmCard.comments = `
      <button class="film-card__comments">${this._comments.length} comments</button>
    `;

    filmCard.controls = `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">WL</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">WTCHD</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">FAV</button>
      </form>
    `;

    const filmCardContent = `
      <article class="film-card">
        ${filmCard.filmTitle}
        ${filmCard.rating}
        ${filmCard.filmInfo}
        ${filmCard.poster}
        ${filmCard.description}
        ${filmCard.comments}
        ${filmCard.controls}
      </article>
    `;

    return filmCardContent.trim();
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._onWatchListButtonClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._onWatchedButtonClick);
    this._element.querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._onFavoriteButtonClick);
  }

  undibind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .removeEventListener(`click`, this._onWatchListButtonClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .removeEventListener(`click`, this._onWatchedButtonClick);
    this._element.querySelector(`.film-card__controls-item--favorite`)
      .removeEventListener(`click`, this._onFavoriteButtonClick);
  }

  reRender() {
    this.undibind();
    this._particularUpdate();
    this.bind();
  }

  update(upData) {
    this.comments = upData.comments;
    this._isAlreadyWatched = upData.isAlreadyWatched;
    this._isFavorite = upData.isFavorite;
    this._isWatchList = upData.isWatchList;
  }

}
