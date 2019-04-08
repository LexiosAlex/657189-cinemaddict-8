import {removeFilmCards} from './remove-film-cards.js';
import renderFilmCard from './render-film-card.js';
import {FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';

let mainFilmCards = null;
let mainFilmPopupCards = null;
let filtersData = `AllFilms`;
let filteredArray = null;

const createCardsData = (data) => {
  mainFilmCards = [];
  mainFilmPopupCards = [];
  for (let i = 0; i < data.length; i++) {
    data[i].controlsDeactivate = false;
    mainFilmCards[i] = new Film(data[i]);
    mainFilmPopupCards[i] = new FilmPopup(data[i]);
  }
};

export const getFiltersDataToChache = (data) => {
  filtersData = data;
}

export const rerenderMainCards = (filmsData) => {
  // НЕ РАБОТАТЬ НАЧИНАЕТ ТУТ. Эта функция отвечает за ререндер карт по новой filmsDat'e
  switch (filtersData) {
    case `AllFilms`:
      createCardsData(filmsData);
      renderFilmCard(filmsData, FILMS_LIST_MAIN, mainFilmCards, mainFilmPopupCards, `extra`, filmsData);
      break;
    case `FavoritesFilms`:
      filteredArray = filmsData.filter((it) => it.isFavorite === true);
      createCardsData(filteredArray);
      renderFilmCard(filteredArray, FILMS_LIST_MAIN, mainFilmCards, mainFilmPopupCards, `extra`, filmsData);
      break;
    case `HistoryFilms`:
      filteredArray = filmsData.filter((it) => it.isAlreadyWatched === true);
      createCardsData(filteredArray);
      renderFilmCard(filteredArray, FILMS_LIST_MAIN, mainFilmCards, mainFilmPopupCards, `extra`, filmsData);
      break;
    case `WatchlistFilms`:
      filteredArray = filmsData.filter((it) => it.isWatchList === true);
      createCardsData(filteredArray);
      renderFilmCard(filteredArray, FILMS_LIST_MAIN, mainFilmCards, mainFilmPopupCards, `extra`, filmsData);
      break;
  }
}


