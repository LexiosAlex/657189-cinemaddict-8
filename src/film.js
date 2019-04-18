import Component from './component.js';
import moment from 'moment';
import createElement from './create-element.js';
const SECOND_DURATION = 1000;
const HOUR_DURATION = 60;

export default class Film extends Component {
  constructor(data) {

    super();
    this._id = data.id;
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
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);

    this._controlsDeactivate = data.controlsDeactivate;
  }

  get filmId() {
    return this._id;
  }

  set onAddToFavorite(fn) {
    this._onAddToFavorite = fn;
  }

  _blockElems(isBlocked) {
    const stateButtons = this._element.querySelectorAll(`.film-card__controls-item`);
    stateButtons.forEach((it) => {
      it.disabled = isBlocked;
    });
  }

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();
    this._isFavorite = !this._isFavorite;
    this._blockElems(true);
    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite(this._isFavorite, this._id)
        .then(() => {
          this.unbind();
          this._particularUpdate();
          this.bind();
        })
        .catch(() =>{
          this._element.style.cssText = `border: 1px solid red`;
        })
        .finally(() => {
          this._blockElems(false);
        });
    }
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  _onWatchListButtonClick(evt) {
    evt.preventDefault();
    this._isWatchList = !this._isWatchList;
    this._blockElems(true);
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(this._isWatchList, this._id)
        .then(() => {
          this.unbind();
          this._particularUpdate();
          this.bind();
        })
        .catch(() =>{
          this._element.style.cssText = `border: 1px solid red`;
        })
        .finally(() => {
          this._blockElems(false);
        });
    }
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();
    this._isAlreadyWatched = !this._isAlreadyWatched;
    this._blockElems(true);
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(this._isAlreadyWatched, this._id)
        .then(() => {
          this.unbind();
          this._particularUpdate();
          this.bind();
        })
        .catch(() =>{
          this._element.style.cssText = `border: 1px solid red`;
        })
        .finally(() => {
          this._blockElems(false);
        });
    }
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  _onCommentsButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onComments === `function`) {
      this._onComments();
    }
  }

  get template() {
    const parseYear = moment.unix(this._year / SECOND_DURATION).format(`YYYY`);

    let parsedDuration = ``;

    if (this._duration > HOUR_DURATION) {
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
      <article class="film-card ${this._controlsDeactivate ? `film-card--no-controls` : `visually-hidden film-card--hidden`}">
        ${filmCard.filmTitle}
        ${filmCard.rating}
        ${filmCard.filmInfo}
        ${filmCard.poster}
        ${filmCard.description}
        ${filmCard.comments}
        ${this._controlsDeactivate ? `` : `${filmCard.controls}`}
      </article>
    `;

    return filmCardContent.trim();
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsButtonClick);
    if (this._controlsDeactivate !== true) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .addEventListener(`click`, this._onWatchListButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .addEventListener(`click`, this._onWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
        .addEventListener(`click`, this._onFavoriteButtonClick);
    }
  }

  undibind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
    if (this._controlsDeactivate !== true) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .removeEventListener(`click`, this._onWatchListButtonClick);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .removeEventListener(`click`, this._onWatchedButtonClick);
      this._element.querySelector(`.film-card__controls-item--favorite`)
        .removeEventListener(`click`, this._onFavoriteButtonClick);
    }
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
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
