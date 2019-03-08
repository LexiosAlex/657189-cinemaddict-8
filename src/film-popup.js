const createElement = (template) => {
  const elementTemplate = document.createElement(`div`);
  elementTemplate.innerHTML = template;
  return elementTemplate.firstChild;
};

export default class filmPopup {
  constructor(data) {
    this._filmTitle = data.filmTitle;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genres = data.genres;
    this._poster = data.poster;
    this._description = data.description;
    this._commentsCount = data.commentsCount;

    this._onClose = null;
    this._element = null;
    this._onButtonClose = this._onButtonClose.bind(this);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onButtonClose(evt) {
    evt.preventDefault();
    return typeof this._onClose === `function` && this._onClose();
  }

  get element() {
    return this._element;
  }

  get template() {
    const parseYear = this._year.getYear() + 1900;
    const parsedDuration = `${this._duration}min`;
    const popupCard = {};
    const filmDetails = {};

    filmDetails.poster = `
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${this._poster}" alt="${this._filmTitle}">

      <p class="film-details__age">18+</p>
    </div>
    `;

    filmDetails.filmTitle = `
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${this._filmTitle}</h3>
        <p class="film-details__title-original">Original: Невероятная семейка</p>
      </div>
      `;

    filmDetails.filmRating = `
      <div class="film-details__rating">
        <p class="film-details__total-rating">${this._rating}</p>
        <p class="film-details__user-rating">Your rate 8</p>
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

    detailsTable.actors = `
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
      </tr>
      `;

    detailsTable.date = `
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">15 June ${parseYear} (USA)</td>
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
        <td class="film-details__cell">USA</td>
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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
      `;

    filmDetails.comments = `
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">1</span></h3>

        <ul class="film-details__comments-list">
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">😴</span>
            <div>
              <p class="film-details__comment-text">So long-long story, boring!</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">Tim Macoveev</span>
                <span class="film-details__comment-day">3 days ago</span>
              </p>
            </div>
          </li>
        </ul>

        <div class="film-details__new-comment">
          <div>
            <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
            <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
              <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
              <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
            </div>
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
          </label>
        </div>
      </section>
      `;

    filmDetails.UserRate = `
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
          <button class="film-details__watched-reset" type="button">undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">Incredibles 2</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" checked>
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9">
              <label class="film-details__user-rating-label" for="rating-9">9</label>

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
  }

  unbind() {
    this.element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onButtonClose);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
