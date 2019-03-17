import Component from './component.js';

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

    this._state = {
      isAlreadyWatched: data.isAlreadyWatched,
      isFavorite: data.isFavorite,
      isWatchList: data.isWatchList,
    };

    this._element = null;
    this._onComments = null;
    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  set onComments(fn) {
    this._onComments = fn;
  }

  _onCommentsButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onComments === `function` && this._onComments();
  }

  get template() {
    const parseYear = this._year.getYear() + 1900;
    let parsedDuration = ``;

    if (this._duration > 60) {
      parsedDuration = `${Math.floor(this._duration / 60)}h ${this._duration - (Math.floor(this._duration / 60) * 60)}m`;
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
  }

  undibind() {
    this._element.querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onCommentsButtonClick);
  }

  _particularUpdate() {
    this._element.innerHTML = this.template;
  }

  reRender() {
    this.undibind();
    this._particularUpdate();
    this.bind();
  }

  update(upData) {
    this.comments = upData.comments;
    this._state.isAlreadyWatched = upData.isAlreadyWatched;
    this._state.isFavorite = upData.isFavorite;
    this._state.isWatchList = upData.isWatchList;
  }

}
