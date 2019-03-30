import Component from './component.js';
import createElement from './create-element.js';
import moment from 'moment';
export default class FilmPopup extends Component {
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
    this._userRate = data.userRate;
    this._originalTitle = data.originalTitle;
    this._ageRating = data.ageRating;
    this._actors = data.actors;
    this._country = data.country;
    this._id = data.id;

    this._isAlreadyWatched = data.isAlreadyWatched;
    this._isFavorite = data.isFavorite;
    this._isWatchList = data.isWatchList;

    this._onSubmit = null;
    this._onClose = null;
    this._element = null;
    this._onSubmitCommentKeyDown = this._onSubmitCommentKeyDown.bind(this);
    this._onButtonClose = this._onButtonClose.bind(this);
    this._onEmojiCommentChange = this._onEmojiCommentChange.bind(this);
    this._filmUnWathced = this._filmUnWathced.bind(this);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onEmojiCommentChange(evt) {
    const emoji = this._parseEmoji(evt.currentTarget.value);
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = emoji;
  }

  _onButtonClose(evt) {
    evt.preventDefault();
    this.element.querySelector(`.film-details__comment-input`).textContent = ``;
    this.element.querySelector(`.film-details__comment-input`).value = ``;
    this._returnData();
    return typeof this._onClose === `function` && this._onClose();
  }

  _returnData() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    this.update(newData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData, this._id);
    }
  }

  _onSubmitCommentKeyDown(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      this._returnData();
      this.unbind();
      this._particularUpdate();
      this.bind();
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _processForm(formData) {
    const entry = {
      userRate: ``,
      isAlreadyWatched: false,
      isFavorite: false,
      isWatchList: false,
      comment: {
        addDate: Date.now(),
        text: ``,
        emoji: ``,
        author: `userName`,
      },
    };

    const filmPopupMapper = FilmPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (typeof filmPopupMapper[property] === `function`) {
        filmPopupMapper[property](value);
      }
    }

    return entry;
  }

  _parseEmoji(emoji) {
    if (emoji === `sleeping`) {
      return `😴`;
    } else if (emoji === `neutral-face`) {
      return `😐`;
    } else if (emoji === `grinning`) {
      return `😀`;
    }
    return false;
  }

  _filmUnWathced() {
    this._element.querySelector(`input[name=watched]`).checked = false;
    this._element.querySelector(`.film-details__watched-status`).classList.remove(`film-details__watched-status--active`);
  }

  get template() {

    const parsedDuration = `${this._duration}min`;

    const popupCard = {};
    const filmDetails = {};

    filmDetails.poster = `
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${this._poster}" alt="${this._filmTitle}">

      <p class="film-details__age">${this._ageRating}+</p>
    </div>
    `;

    filmDetails.filmTitle = `
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${this._filmTitle}</h3>
        <p class="film-details__title-original">Original: ${this._originalTitle}</p>
      </div>
      `;

    filmDetails.filmRating = `
      <div class="film-details__rating">
        <p class="film-details__total-rating">${this._rating}</p>
        ${this._userRate ? `<p class="film-details__user-rating">Your rate ${this._userRate}</p>` : ``}
      </div>
    `;

    const detailsTable = {};

    detailsTable.director = `
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">Brad Bird</td>
      </tr>
      `;

    detailsTable.writters = `
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">Brad Bird</td>
      </tr>
      `;

    const actors = {};

    actors.actor = `${[...this._actors].map((actor) => `${actor}`).join(`, `)}`;

    detailsTable.actors = `
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors.actor}</td>
      </tr>
      `;

    detailsTable.date = `
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${moment.unix(this._year / 1000).format(`MMMM D YYYY`)} (${this._country})</td>
      </tr>
      `;

    detailsTable.duration = `
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${parsedDuration}</td>
      </tr>
    `;

    detailsTable.country = `
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${this._country}</td>
      </tr>
    `;

    const genres = {};

    genres.genre = `${[...this._genres].map((genre) => `
      <span class="film-card__genre">${genre}</span>
    `).join(``)}`;

    detailsTable.genres = `
      <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
          ${genres.genre}
      </tr>
    `;

    popupCard.detailsTable = `
    <table class="film-details__table">
      ${detailsTable.director}
      ${detailsTable.writters}
      ${detailsTable.actors}
      ${detailsTable.date}
      ${detailsTable.duration}
      ${detailsTable.country}
      ${detailsTable.genres}
    </table>
    `;

    filmDetails.description = `
      <p class="film-details__film-description">
        ${this._description}
      </p>
      `;

    filmDetails.controls = `
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isAlreadyWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
      `;

    filmDetails.comments = `
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
        <ul class="film-details__comments-list">
        ${this._comments.map((comment) => `
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">${this._parseEmoji(comment.emoji)}</span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${moment.unix(comment.addDate / 1000).fromNow()}</span>
              </p>
            </div>
          </li>`).join(``)}
        </ul>

        <div class="film-details__new-comment">
          <div>
            <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
            <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

              <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
              <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

              <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-grinning" value="grinning">
              <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
            </div>
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
          </label>
        </div>
      </section>
      `;
    const getRatingString = (rating) => {
      const arr = [];
      for (let i = 0; i < 10; i++) {
        if (rating === i.toString()) {
          arr[i] = `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" checked>
                  <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
        } else {
          arr[i] = `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}">
                  <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
        }
      }
      return arr.join(``);
    };

    filmDetails.UserRate = `
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">

          <span class="film-details__watched-status ${this._isAlreadyWatched ? `film-details__watched-status--active` : ``}">Already watched</span>

          <button class="film-details__watched-reset" type="button">undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="${this._filmTitle}" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._filmTitle}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">

            ${getRatingString(this._userRate)}

            </div>
          </section>
        </div>
      </section>
      `;

    popupCard.filmDetails = `
        <div class="film-details__info-wrap">
          ${filmDetails.poster}
          <div class="film-details__info">
            <div class="film-details__info-head">
              ${filmDetails.filmTitle}
              ${filmDetails.filmRating}
            </div>
          ${popupCard.detailsTable}
          ${filmDetails.description}
          </div>
        </div>
        ${filmDetails.controls}
        ${filmDetails.comments}
        ${filmDetails.UserRate}
      `;

    const popupCardElement = `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${popupCard.filmDetails}
        </form>
      </section>
      `;

    return popupCardElement.trim();

  }

  bind() {
    this.element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onButtonClose);
    this.element.querySelectorAll(`input[name = commentEmoji]`).forEach((it) => {
      it.addEventListener(`click`, this._onEmojiCommentChange);
    });
    this.element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._filmUnWathced);
    document.addEventListener(`keydown`, this._onSubmitCommentKeyDown);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    this.element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onButtonClose);
    this.element.querySelectorAll(`input[name = commentEmoji]`).forEach((it) => {
      it.removeEventListener(`click`, this._onEmojiCommentChange);
    });
    this.element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._filmUnWathced);
    document.removeEventListener(`keydown`, this._onSubmitCommentKeyDown);
  }

  update(upData) {
    this._userRate = upData.userRate;
    if (upData.comment && upData.comment.text.length) {
      this._comments.push(upData.comment);
    }
    this._isAlreadyWatched = upData.isAlreadyWatched;
    this._isFavorite = upData.isFavorite;
    this._isWatchList = upData.isWatchList;
  }

  static createMapper(target) {
    return {
      commentEmoji: (value) => {
        target.comment.emoji = value;
      },
      comment: (value) => {
        target.comment.text = value;
      },
      score: (value) => {
        target.userRate = value;
      },
      watchlist: () => {
        target.isWatchList = true;
      },
      watched: () => {
        target.isAlreadyWatched = true;
      },
      favorite: () => {
        target.isFavorite = true;
      },
    };
  }

}
