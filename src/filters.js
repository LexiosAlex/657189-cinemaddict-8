import Filter from './filter.js';
import {FILTERS_AREA} from './export-const.js';

const filmsArea = document.querySelector(`.films`);
const statisticArea = document.querySelector(`.statistic`);

export const showFilms = () => {
  if (filmsArea.classList.contains(`visually-hidden`)) {
    filmsArea.classList.remove(`visually-hidden`);
    statisticArea.classList.add(`visually-hidden`);
  }
};

export const hideFilms = () => {
  if (statisticArea.classList.contains(`visually-hidden`)) {
    filmsArea.classList.add(`visually-hidden`);
    statisticArea.classList.remove(`visually-hidden`);
  }
};

export const createFilters = (data) => {
  return data.map((it) => new Filter(it));
};

export const getFavoritesFilter = (filters) => {
  return filters[filters.findIndex((it) => it.id === `FavoritesFilms`)];
};

export const getHistoryFilter = (filters) => {
  return filters[filters.findIndex((it) => it.id === `HistoryFilms`)];
};

export const getWatchListFilter = (filters) => {
  return filters[filters.findIndex((it) => it.id === `WatchlistFilms`)];
};

export const unrenderFilters = () => {
  let filterArray = FILTERS_AREA.querySelectorAll(`.main-navigation__item`);
  filterArray.forEach((item) => {
    FILTERS_AREA.removeChild(item);
  });
};
