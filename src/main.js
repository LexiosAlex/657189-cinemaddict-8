import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import Backend from './backend.js';
import renderFilmCard from './render-film-card.js';
import {renderFilters, getFiltersData} from './filters.js';
import {getStatsData} from './statistics.js';

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
  // .catch(() => {
  //   messageTemplate.firstChild.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  //   messageTemplate.style.border = `2px solid red`;
  // });

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

  const topCommmArea = document.querySelector(`.films-list__container--top-commented`);
  let topCommsData = null;
  const getTopCommentData = (data) => {
    const topCommentSort = data.slice();
    topCommentSort.sort((a, b) => {
      return b.comments.length - a.comments.length;
    });

    topCommentSort.forEach((it) => {
      it.controlsDeactivate = true;
    });

    topCommsData = topCommentSort.slice(0, 2);
  };

  getTopCommentData(filmsData);
  let commentFilmCards = [];
  let commentFilmPopupCards = [];

  const renderExtraFilms = (data, area, extraFilmCards, extraFilmPopupCards) => {
    extraFilmCards = [];
    extraFilmPopupCards = [];
    data.forEach((it) => {
      extraFilmCards.push(new Film(it));
      extraFilmPopupCards.push(new FilmPopup(it));
    });

    renderFilmCard(data, area, extraFilmCards, extraFilmPopupCards, `main`, filmsData);
  };

  renderExtraFilms(topCommsData, topCommmArea, commentFilmCards, commentFilmPopupCards);


  const topRatedArea = document.querySelector(`.films-list__container--top-rated`);
  let topRateData = null;
  const getTopRatedData = (data) => {
    const topRatedSort = data.slice();
    topRatedSort.sort((a, b) => {
      return b.rating - a.rating;
    });

    topRatedSort.forEach((it) => {
      it.controlsDeactivate = true;
    });

    topRateData = topRatedSort.slice(0, 2);
  };

  getTopRatedData(filmsData);
  let topRatedFilmCards = [];
  let topRatedFilmsPopupCards = [];

  renderExtraFilms(topRateData, topRatedArea, topRatedFilmCards, topRatedFilmsPopupCards);

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


// const renderFilmCard = (data, area, mainFilmCards, mainFilmPopupCards, whichCardsUpdate) => {
//   for (let i = 0; i < data.length; i++) {
//     let filmCard = mainFilmCards[i];
//     let filmPopupElement = mainFilmPopupCards[i];

//     area.appendChild(filmCard.render());

//     const rerenderCards = () => {
//       if (whichCardsUpdate === `main`) {
//         removeFilmCards(filmCards);
//         createCardsData(filmsData);
//         renderFilmCard(filmsData, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
//       }

//       if (whichCardsUpdate === `extra`) {
//         removeFilmCards(commentFilmCards);
//         getTopCommentData(filmsData);
//         renderExtraFilms(topCommsData, topCommmArea, commentFilmCards, commentFilmPopupCards);
//         removeFilmCards(topRatedFilmCards);
//         getTopRatedData(filmsData);
//         renderExtraFilms(topRateData, topRatedArea, topRatedFilmCards, topRatedFilmsPopupCards);
//       }
//     };

//     filmCard.onComments = () => {
//       document.body.appendChild(filmPopupElement.render());
//     };

//     filmCard.onMarkAsWatched = (state, id) => {
//       const dataIndex = data.findIndex((it) => it.id === id);
//       data[dataIndex].isAlreadyWatched = state;

//       updateFiltersData(`HistoryFilms`, state);
//       filmPopupElement.update(data[dataIndex]);
//       filmCard.reRender();

//       removeFilters(filters);
//       renderFilters(filtersData);
//       getStatsData();


//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//       });
//     };

//     filmCard.onAddToFavorite = (state, id) => {
//       const dataIndex = data.findIndex((it) => it.id === id);
//       data[dataIndex].isFavorite = state;

//       updateFiltersData(`FavoritesFilms`, state);

//       filmPopupElement.update(data[dataIndex]);
//       filmCard.reRender();

//       removeFilters(filters);
//       renderFilters(filtersData);

//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//       });
//     };

//     filmCard.onAddToWatchList = (state, id) => {
//       const dataIndex = data.findIndex((it) => it.id === id);
//       data[dataIndex].isWatchList = state;

//       updateFiltersData(`WatchlistFilms`, state);

//       filmPopupElement.update(data[dataIndex]);
//       filmCard.reRender();

//       removeFilters(filters);
//       renderFilters(filtersData);

//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//       });
//     };

//     filmPopupElement.onSubmitComment = (id, comment) => {
//       const dataIndex = data.findIndex((it) => it.id === id);
//       data[dataIndex].comments.push(comment);

//       filmCard.reRender();
//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//         showMore();
//       });
//     };

//     filmPopupElement.onFilmDetailsChange = (id, newObject) => {

//       const dataIndex = data.findIndex((it) => it.id === id);

//       if (newObject.isAlreadyWatched !== data[dataIndex].isAlreadyWatched) {
//         updateFiltersData(`HistoryFilms`, newObject.isAlreadyWatched);
//         data[dataIndex].isAlreadyWatched = newObject.isAlreadyWatched;
//       }
//       if (newObject.isFavorite !== data[dataIndex].isFavorite) {
//         updateFiltersData(`FavoritesFilms`, newObject.isFavorite);
//         data[dataIndex].isFavorite = newObject.isFavorite;
//       }
//       if (newObject.isWatchList !== data[dataIndex].isWatchList) {
//         updateFiltersData(`WatchlistFilms`, newObject.isWatchList);
//         data[dataIndex].isWatchList = newObject.isWatchList;
//       }

//       filmCard.update(data[dataIndex]);
//       filmCard.reRender();


//       removeFilters(filters);
//       renderFilters(filtersData);
//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//         showMore();
//       });
//     };

//     filmPopupElement.onClose = () => {
//       filmPopupElement.unrender();
//     };

//     filmPopupElement.onScoreChange = (id, rating) => {

//       const dataIndex = data.findIndex((it) => it.id === id);
//       data[dataIndex].userRate = rating;

//       return api.updateMovie({id, data: data[dataIndex].toRaw()})
//       .then(() => {
//         rerenderCards(whichCardsUpdate);
//         showMore();
//       });
//     };
//   }
// };

// const removeFilmCards = (filmCards) => {
//   for (let i = 0; i < filmCards.length; i++) {
//     let filmCard = filmCards[i];

//     filmCard.unrender();
//   }
// };
