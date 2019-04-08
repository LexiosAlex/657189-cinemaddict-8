import Filter from './filter.js';
import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import {removeFilmCards} from './remove-film-cards.js';
import renderFilmCard from './render-film-card.js';
import {getStatsData, renderStatsComponent, unrenderStatsComponent} from './statistics.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';

const filmsArea = document.querySelector(`.films`);
const statisticArea = document.querySelector(`.statistic`);
let filteredfilmCards = [];
let filteredfilmPopupCards = [];
let filtersData = [];
let filters = [];

export const getFiltersData = (data) => {
  filtersData = data;
};

const createCardsData = (data) => {
  filteredfilmCards = [];
  filteredfilmPopupCards = [];
  for (let i = 0; i < data.length; i++) {
    data[i].controlsDeactivate = false;
    filteredfilmCards[i] = new Film(data[i]);
    filteredfilmPopupCards[i] = new FilmPopup(data[i]);
  }
};

export const updateFiltersData = (filterId, state) => {
  const filterIndex = filtersData.findIndex((it) => it.id === filterId);
  if (state) {
    filtersData[filterIndex].amount++;
  } else {
    filtersData[filterIndex].amount--;
  }
};

const showFilms = () => {
  if (filmsArea.classList.contains(`visually-hidden`)) {
    filmsArea.classList.remove(`visually-hidden`);
    statisticArea.classList.add(`visually-hidden`);
  }
};

const hideFilms = () => {
  if (statisticArea.classList.contains(`visually-hidden`)) {
    filmsArea.classList.add(`visually-hidden`);
    statisticArea.classList.remove(`visually-hidden`);
  }
};

export const renderFilters = (filmsData, filmCards) => {
  for (let i = 0; i < filtersData.length; i++) {
    filters[i] = new Filter(filtersData[i]);
  }

  const filterAll = filters[filtersData.findIndex((it) => it.id === `AllFilms`)];
  const filterWatchlistFilms = filters[filtersData.findIndex((it) => it.id === `WatchlistFilms`)];
  const filterHistoryFilms = filters[filtersData.findIndex((it) => it.id === `HistoryFilms`)];
  const filterFavoritesFilms = filters[filtersData.findIndex((it) => it.id === `FavoritesFilms`)];
  const filterStats = filters[filtersData.findIndex((it) => it.id === `Stats`)];

  FILTERS_AREA.appendChild(filterAll.render());
  FILTERS_AREA.appendChild(filterWatchlistFilms.render());
  FILTERS_AREA.appendChild(filterHistoryFilms.render());
  FILTERS_AREA.appendChild(filterFavoritesFilms.render());
  FILTERS_AREA.appendChild(filterStats.render());


  const deActivateAll = () => {
    filtersData.forEach((it) =>{
      it.active = false;
    });
    filterHistoryFilms.deActivate();
    filterAll.deActivate();
    filterWatchlistFilms.deActivate();
    filterFavoritesFilms.deActivate();
    filterStats.deActivate();
  };

  const updateAll = () => {
    filterAll.unrender();
    FILTERS_AREA.appendChild(filterAll.render());

    filterWatchlistFilms.unrender();
    FILTERS_AREA.appendChild(filterWatchlistFilms.render());

    filterHistoryFilms.unrender();
    FILTERS_AREA.appendChild(filterHistoryFilms.render());

    filterFavoritesFilms.unrender();
    FILTERS_AREA.appendChild(filterFavoritesFilms.render());

    filterStats.unrender();
    FILTERS_AREA.appendChild(filterStats.render());
  };

  const filterActivate = (filterName, dataFilter, filterId, stateName) => {
    showFilms();
    const filteredArray = filmsData.filter((it) => it[stateName] === true);

    removeFilmCards(filteredfilmCards);
    if (filmCards) {
      removeFilmCards(filmCards);
    }
    createCardsData(filteredArray);
    renderFilmCard(filteredArray, FILMS_LIST_MAIN, filteredfilmCards, filteredfilmPopupCards, `extra`, filmsData);
    deActivateAll();
    dataFilter[dataFilter.findIndex((it) => it.id === filterId)].active = true;
    filterName.activate();
    updateAll();
    showMore();
  };

  filterAll.onFilterClick = () => {
    showFilms();
    removeFilmCards(filteredfilmCards);
    if (filmCards) {
      removeFilmCards(filmCards);
    }
    createCardsData(filmsData);
    renderFilmCard(filmsData, FILMS_LIST_MAIN, filteredfilmCards, filteredfilmPopupCards, `extra`, filmsData);
    deActivateAll();
    filterAll.activate();
    filtersData[filtersData.findIndex((it) => it.id === `AllFilms`)].active = true;
    updateAll();
    showMore();
  };

  filterWatchlistFilms.onFilterClick = () => {
    filterActivate(filterWatchlistFilms, filtersData, `WatchlistFilms`, `isWatchList`);
  };

  filterHistoryFilms.onFilterClick = () => {
    filterActivate(filterHistoryFilms, filtersData, `HistoryFilms`, `isAlreadyWatched`);
  };

  filterFavoritesFilms.onFilterClick = () => {
    filterActivate(filterFavoritesFilms, filtersData, `FavoritesFilms`, `isFavorite`);
  };

  filterStats.onFilterClick = () => {
    hideFilms();
    deActivateAll();
    filterStats.activate();
    updateAll();
    unrenderStatsComponent();
    getStatsData(filmsData);
    renderStatsComponent();
  };
};

export const removeFilters = () => {
  filters.forEach((it) =>{
    it.unrender();
  });
};


const showMore = () => {
  if (filteredfilmCards.length < 5) {
    showMoreButton.classList.add(`visually-hidden`);
  }
  for (let i = 0; i < 5; i++) {
    if (FILMS_LIST_MAIN.querySelector(`.film-card--hidden`)) {
      showMoreButton.classList.remove(`visually-hidden`);
      const film = FILMS_LIST_MAIN.querySelector(`.film-card--hidden`);
      film.classList.remove(`film-card--hidden`, `visually-hidden`);
    } else {
      showMoreButton.classList.add(`visually-hidden`);
    }
  }
};

const showMoreButton = document.querySelector(`.films-list__show-more`);
