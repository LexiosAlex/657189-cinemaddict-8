export default (data, tempArea) => {
  const {filmTitle, rating, year, duration, genres, poster, description, commentsCount} = data;
  const filmCard = {};
  const elementTemplate = document.createElement(`template`);
  const parseYear = year.getYear() + 1900;
  let parsedDuration = ``;
  const parseDurationHours = () => {
    if (duration.getUTCHours() > 0) {
      parsedDuration = `${duration.getUTCHours()}h ${duration.getUTCMinutes()}m`;
    } else {
      parsedDuration = `${duration.getUTCMinutes()}m`;
    }
  };

  parseDurationHours();

  filmCard.filmTitle = `
    <h3 class="film-card__title">${filmTitle}</h3>
  `;

  filmCard.rating = `
    <p class="film-card__rating">${rating}</p>
  `;

  const filmInfo = {};

  filmInfo.year = `
    <span class="film-card__year">${parseYear}</span>
  `;

  filmInfo.duration = `
    <span class="film-card__duration">${parsedDuration}</span>
  `;

  filmInfo.genre = `${[...genres].map((genre) => `
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
    <img src="${poster}" alt="" class="film-card__poster">
  `;

  filmCard.description = `
    <p class="film-card__description">
      ${description}
    </p>
  `;

  filmCard.comments = `
    <button class="film-card__comments">${commentsCount} comments</button>
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

  elementTemplate.innerHTML = filmCardContent;
  tempArea.appendChild(elementTemplate.content);
};
