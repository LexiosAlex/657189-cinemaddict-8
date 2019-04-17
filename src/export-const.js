const FILTERS_AREA = document.querySelector(`.main-navigation`);
const ALL_FILMS_AREA = document.querySelectorAll(`.films-list__container`);
const FILMS_LIST_MAIN = document.querySelector(`.films-list--main`).querySelector(`.films-list__container`);
const MOVIES_STORE_KEY = `tasks-store-key`;
const AUTHORIZATION = `Basic eo0w597ik56219a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const TOP_COMM_AREA = document.querySelector(`.films-list__container--top-commented`);
const TOP_RATE_AREA = document.querySelector(`.films-list__container--top-rated`);
const STISTIC_AREA = document.querySelector(`.statistic`);
const PROFILE_RATING_AREA = document.querySelector(`.profile__rating`);
const SHOW_MORE_BUTTON = document.querySelector(`.films-list__show-more`);
const METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export {
  FILTERS_AREA,
  ALL_FILMS_AREA,
  FILMS_LIST_MAIN,
  MOVIES_STORE_KEY,
  AUTHORIZATION,
  END_POINT,
  TOP_RATE_AREA,
  TOP_COMM_AREA,
  STISTIC_AREA,
  PROFILE_RATING_AREA,
  SHOW_MORE_BUTTON,
  METHOD
};
