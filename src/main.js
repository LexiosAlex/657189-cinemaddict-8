import {FILTERS_AREA, ALL_FILMS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import renderFilter from './render-filter.js';
import createFilmCard from './create-film-card.js';

const filterElements = [
  {
    id: `All`,
    caption: `All movies`,
    active: true
  },
  {
    id: `Watchlist`,
    caption: `Watchlist`,
    amount: 13
  },
  {
    id: `History`,
    caption: `History`,
    amount: 4
  },
  {
    id: `Favorites`,
    caption: `Favorites`,
    amount: 8
  },
  {
    id: `Stats`,
    caption: `Stats`
  }
];

const removeFilters = () => {
  let filterArray = FILTERS_AREA.querySelectorAll(`.main-navigation__item`);
  filterArray.forEach((item) => {
    FILTERS_AREA.removeChild(item);
  });
};

removeFilters();
renderFilter(filterElements);

const filmExample = {
  filmTitle: `Shrek2`,
  rating: 10,
  year: 2007,
  duration: `1h 32min`,
  genre: `fantasy`,
  poster: `./images/posters/three-friends.jpg`,
  description: `Фильм про болото, руке волос, жожо корма`,
  commentsCount: 69
};

const renderFilmCard = (data, count, area) => {
  for (let i = 0; i < count; i++) {
    createFilmCard(data, area);
  }
};

const renderExamples = () => {
  ALL_FILMS_AREA.forEach((item) => {
    renderFilmCard(filmExample, 2, item);
  });
};

renderExamples();

renderFilmCard(filmExample, 5, FILMS_LIST_MAIN);

const removeFilmCards = () => {
  let filmsArray = FILMS_LIST_MAIN.querySelectorAll(`.film-card`);
  filmsArray.forEach((item) => {
    FILMS_LIST_MAIN.removeChild(item);
  });
};

const filtersListener = () => {
  FILTERS_AREA.querySelectorAll(`.main-navigation__item`).forEach((item) => {
    item.addEventListener(`click`, () => {
      removeFilmCards();
      let randomValue = Math.floor(Math.random() * 10);
      renderFilmCard(filmExample, randomValue, ALL_FILMS_AREA[0]);
    });
  });
};
filtersListener();
