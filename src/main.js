import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import Statistics from './statistic.js';

import Backend from './backend.js';
import Provider from './provider.js';
import Store from './store.js';

import {createFilters, showFilms, hideFilms, unrenderFilters, getFavoritesFilter, getHistoryFilter, getWatchListFilter} from './filters.js';

const AUTHORIZATION = `Basic eo0w597ik56219a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const apiData = {endPoint: END_POINT, authorization: AUTHORIZATION};
const MOVIES_STORE_KEY = `tasks-store-key`;

const store = new Store({key: MOVIES_STORE_KEY, storage: localStorage});
const api = new Backend(apiData);
const provider = new Provider({api, store});

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

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncMovies();
});

provider.getMovie()
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

  unrenderFilters();

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

  let filters = [];

  const renderFilmCard = (data, area, mainFilmCards, mainFilmPopupCards, whichCardsUpdate) => {
    for (let i = 0; i < data.length; i++) {
      let filmCard = mainFilmCards[i];
      let filmPopupElement = mainFilmPopupCards[i];

      area.appendChild(filmCard.render());

      const rerenderCards = () => {
        if (whichCardsUpdate === `main`) {
          removeFilmCards(filmCards);
          createCardsData(filmsData);
          renderFilmCard(filmsData, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
        }

        if (whichCardsUpdate === `extra`) {
          getTopCommentData(filmsData);
          renderTopComments(filmsData);
          getTopRatedData(filmsData);
          renderTopRated(filmsData);
        }
      };

      filmCard.onComments = () => {
        document.body.appendChild(filmPopupElement.render());
      };

      filmCard.onMarkAsWatched = (state, id) => {
        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].isAlreadyWatched = state;

        filmPopupElement.update(data[dataIndex]);
        if (state) {
          data[dataIndex].watchingDate = Date.now();
        } else {
          data[dataIndex].watchingDate = null;
        }
        filmCard.reRender();

        const filter = filters[filters.findIndex((it) => it.id === `HistoryFilms`)];
        const amount = filmsData.filter((it) => it.isAlreadyWatched === true).length;
        filter.update({amount});
        filter.reRender();

        statisticComponent.getStatisticData(filmsData);

        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
        });
      };

      filmCard.onAddToFavorite = (state, id) => {
        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].isFavorite = state;

        filmPopupElement.update(data[dataIndex]);
        filmCard.reRender();

        const filter = filters[filters.findIndex((it) => it.id === `FavoritesFilms`)];
        const amount = filmsData.filter((it) => it.isFavorite === true).length;
        filter.update({amount});
        filter.reRender();

        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
        });
      };

      filmCard.onAddToWatchList = (state, id) => {
        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].isWatchList = state;

        filmPopupElement.update(data[dataIndex]);
        filmCard.reRender();

        const filter = filters[filters.findIndex((it) => it.id === `WatchlistFilms`)];
        const amount = filmsData.filter((it) => it.isWatchList === true).length;
        filter.update({amount});
        filter.reRender();

        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
        });
      };

      filmPopupElement.onSubmitComment = (id, comment) => {
        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].comments.push(comment);

        filmCard.reRender();
        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
          showMore();
        });
      };

      filmPopupElement.onUndoLastComment = (id, comments) => {
        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].comments = comments;

        filmCard.reRender();

        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
          showMore();
        });
      };

      filmPopupElement.onFilmDetailsChange = (id, newObject) => {

        const dataIndex = data.findIndex((it) => it.id === id);


        let filter;
        let amount;

        if (newObject.isAlreadyWatched !== data[dataIndex].isAlreadyWatched) {

          if (newObject.isAlreadyWatched === false) {
            data[dataIndex].watchingDate = null;
          } else {
            data[dataIndex].watchingDate = Date.now();
          }
          data[dataIndex].isAlreadyWatched = newObject.isAlreadyWatched;

          filter = getHistoryFilter(filters);
          amount = filmsData.filter((it) => it.isAlreadyWatched === true).length;
        }
        if (newObject.isFavorite !== data[dataIndex].isFavorite) {

          data[dataIndex].isFavorite = newObject.isFavorite;

          filter = getFavoritesFilter(filters);
          amount = filmsData.filter((it) => it.isFavorite === true).length;
        }
        if (newObject.isWatchList !== data[dataIndex].isWatchList) {

          data[dataIndex].isWatchList = newObject.isWatchList;

          filter = getWatchListFilter(filters);
          amount = filmsData.filter((it) => it.isWatchList === true).length;
        }

        filmCard.update(data[dataIndex]);
        filmCard.reRender();

        filter.update({amount});
        filter.reRender();

        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
        });
      };

      filmPopupElement.onClose = () => {
        filmPopupElement.unrender();
      };

      filmPopupElement.onScoreChange = (id, rating) => {

        const dataIndex = data.findIndex((it) => it.id === id);
        data[dataIndex].userRate = rating;
        return provider.updateMovie({id, data: data[dataIndex].toRaw()})
        .then(() => {
          rerenderCards(whichCardsUpdate);
        });
      };
    }
  };

  const removeFilmCards = (cards) => {
    for (const filmCard of cards) {
      filmCard.unrender();
    }
  };

  renderFilmCard(filmsData, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);

  const topCommmArea = document.querySelector(`.films-list__container--top-commented`);
  const topRatedArea = document.querySelector(`.films-list__container--top-rated`);
  let topCommsData = null;
  let commentFilmCards = [];
  let commentFilmPopupCards = [];
  let topRateData = null;
  let topRatedFilmCards = [];
  let topRatedFilmsPopupCards = [];

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

  const renderTopComments = () => {
    removeFilmCards(commentFilmCards);
    commentFilmCards = [];
    commentFilmPopupCards = [];
    topCommsData.forEach((it) => {
      commentFilmCards.push(new Film(it));
      commentFilmPopupCards.push(new FilmPopup(it));
    });
    renderFilmCard(topCommsData, topCommmArea, commentFilmCards, commentFilmPopupCards, `main`);
  };


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

  const renderTopRated = () => {
    removeFilmCards(topRatedFilmCards);
    topRatedFilmCards = [];
    topRatedFilmsPopupCards = [];
    topRateData.forEach((it) => {
      topRatedFilmCards.push(new Film(it));
      topRatedFilmsPopupCards.push(new FilmPopup(it));
    });
    renderFilmCard(topRateData, topRatedArea, topRatedFilmCards, topRatedFilmsPopupCards, `main`);
  };

  getTopCommentData(filmsData);
  renderTopComments();
  getTopRatedData(filmsData);
  renderTopRated();

  const renderFilters = (data) => {
    filters = createFilters(data);

    const onFilterClick = (id) => {
      removeFilmCards(filmCards);
      // createCardsData(filmsData);

      let filteredFilms;
      switch (id) {
        case `AllFilms`:
          showFilms();
          filteredFilms = filmsData;
          createCardsData(filteredFilms);
          renderFilmCard(filteredFilms, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
          break;

        case `WatchlistFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isWatchList === true);
          createCardsData(filteredFilms);
          renderFilmCard(filteredFilms, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
          break;

        case `HistoryFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isAlreadyWatched === true);
          createCardsData(filteredFilms);
          renderFilmCard(filteredFilms, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
          break;

        case `FavoritesFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isFavorite === true);
          createCardsData(filteredFilms);
          renderFilmCard(filteredFilms, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
          break;

        case `Stats`:
          hideFilms();
          unrenderStatsComponent();
          renderStatsComponent();
          break;
      }

      filters.forEach((it) => {
        it.deActivate();
      });

      const filter = filters[filters.findIndex((it) => it.id === id)];
      filter.activate();

      filters.forEach((it) => {
        it.reRender();
      });

      searchBar.value = ``;
      showMore();
    };

    filters.forEach((it) => {
      it.onFilterClick = onFilterClick;
      FILTERS_AREA.appendChild(it.render());
    });
  };

  renderFilters([
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
  ]);

  let statisticComponent;
  const statisticArea = document.querySelector(`.statistic`);

  const renderStatsComponent = () => {
    statisticComponent = new Statistics(filmsData);
    statisticComponent.getStatisticData(filmsData);
    statisticArea.appendChild(statisticComponent.render());
    statisticComponent.statisticDiagram();
  };

  renderStatsComponent();

  const unrenderStatsComponent = () => {
    if (statisticComponent) {
      statisticComponent.unrender();
    }
  };


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
    for (let i = 0; i < 5; i++) {
      if (FILMS_LIST_MAIN.querySelector(`.film-card--hidden`)) {
        const film = FILMS_LIST_MAIN.querySelector(`.film-card--hidden`);
        film.classList.remove(`film-card--hidden`, `visually-hidden`);
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

    filters.forEach((it) =>{
      it.deActivate();
    });
    filters[filters.findIndex((it) => it.id === `AllFilms`)].activate();
    removeFilmCards(filmCards);
    if (searchedArray.length > 0) {
      createCardsData(searchedArray);
    }
    renderFilmCard(searchedArray, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`);
    filters.forEach((it) =>{
      it.reRender();
    });
    showMore();
  }, 500));

  function debounce(f, ms) {

    let timer = null;

    return function (...args) {
      const onComplete = () => {
        f(...args);
        timer = null;
      };

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(onComplete, ms);
    };
  }

};
