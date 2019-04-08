import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import Backend from './backend.js';
import renderFilmCard from './render-film-card.js';
import {renderFilters, getFiltersData} from './filters.js';
import {getStatsData} from './statistics.js';
import {getTopCommentData, renderTopComments, getTopRatedData, renderTopRated} from './render-extra-film-cards.js';

const AUTHORIZATION = `Basic eo0w590ik56219a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const apiData = {endPoint: END_POINT, authorization: AUTHORIZATION};
const api = new Backend(apiData);

const template = `<div>Loading movies...</div>`;
const messageTemplate = document.createElement(`div`);
messageTemplate.innerHTML = template;
messageTemplate.style.cssText = `
  display: flex;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 300px;
  margin-bottom: 300px;
  height: 150px;
  border: solid 2px var(--outline-color);
  align-items: center;
  justify-content: center;
  text-align: center;
`;
FILMS_LIST_MAIN.appendChild(messageTemplate);

api.getMovie()
  .then((films) =>{
    mainFunction(films);
    messageTemplate.classList.add(`visually-hidden`);
  })
  .catch(() => {
    messageTemplate.firstChild.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
    messageTemplate.style.border = `2px solid red`;
  });

const mainFunction = (filmsData) => {
  let filmCards = [];
  let filmPopupCards = [];

  const filtersData = [
    {
      id: `AllFilms`,
      caption: `All movies`,
      active: true
    },
    {
      id: `WatchlistFilms`,
      caption: `Watchlist`,
      amount: filmsData.filter((it) => it.isWatchList === true).length,
      active: false
    },
    {
      id: `HistoryFilms`,
      caption: `History`,
      amount: filmsData.filter((it) => it.isAlreadyWatched === true).length,
      active: false
    },
    {
      id: `FavoritesFilms`,
      caption: `Favorites`,
      amount: filmsData.filter((it) => it.isFavorite === true).length,
      active: false
    },
    {
      id: `Stats`,
      caption: `Stats`
    }
  ];

  getFiltersData(filtersData);

  const unrenderFilters = () => {
    let filterArray = FILTERS_AREA.querySelectorAll(`.main-navigation__item`);
    filterArray.forEach((item) => {
      FILTERS_AREA.removeChild(item);
    });
  };

  unrenderFilters(filmsData);

  const createCardsData = (data) => {
    filmCards = [];
    filmPopupCards = [];
    for (let i = 0; i < data.length; i++) {
      data[i].controlsDeactivate = false;
      filmCards[i] = new Film(data[i]);
      filmPopupCards[i] = new FilmPopup(data[i]);
    }
  };

  createCardsData(filmsData);

  renderFilmCard(filmsData, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`, filmsData);

  getTopCommentData(filmsData);
  getTopRatedData(filmsData);

  renderTopComments(filmsData);
  renderTopRated(filmsData);

  renderFilters(filmsData, filmCards);
  getStatsData(filmsData);

  const profileRating = document.querySelector(`.profile__rating`);
  const watchedMovies = filmsData.filter((it) => it[`isAlreadyWatched`] === true);

  if (watchedMovies.length < 11) {
    profileRating.textContent = `novice`;
  }

  if (watchedMovies.length < 21 & filmsData.length > 10) {
    profileRating.textContent = `fan`;
  }

  if (watchedMovies.length > 20) {
    profileRating.textContent = `movie buff`;
  }

  document.querySelector(`.footer__statistics`).textContent = `${filmsData.length} movies inside`;


  const showMore = () => {
    if (filmCards.length < 5) {
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
  showMoreButton.addEventListener(`click`, showMore);
  showMore();

  const searchBar = document.querySelector(`input[name=search]`);

  searchBar.addEventListener(`keyup`, debounce((evt) => {

    const searchText = evt.target.value.toLowerCase();
    const searchedArray = filmsData.filter((it) =>
      it.filmTitle.toLowerCase().indexOf(searchText) !== -1
    );
//  FILTER
  }, 500));

  function debounce(f, ms) {

    let timer = null;

    return function (...args) {
      const onComplete = () => {
        f.apply(this, args);
        timer = null;
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(onComplete, ms);
    };
  }

};
