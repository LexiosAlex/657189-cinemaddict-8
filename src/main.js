import {FILTERS_AREA, FILMS_LIST_MAIN, AUTHORIZATION, END_POINT, MOVIES_STORE_KEY, TOP_COMM_AREA, TOP_RATE_AREA, STISTIC_AREA, PROFILE_RATING_AREA, SHOW_MORE_BUTTON} from './export-const.js';
import FilmPopup from './film-popup.js';
import Statistics from './statistic.js';
import {renderFilmCards, removeFilmCards} from './render-film-card.js';
import {getTopCommentData, getTopRatedData} from './extra-film-cards.js';
import {createCardsData} from './create-cards-data.js';
import {hideLoadMassage, erorMassage} from './load-message.js';

import Backend from './backend.js';
import Provider from './provider.js';
import Store from './store.js';

import {createFilters, showFilms, hideFilms, unrenderFilters, getFavoritesFilter, getHistoryFilter, getWatchListFilter} from './filters.js';

const apiData = {endPoint: END_POINT, authorization: AUTHORIZATION};
const store = new Store({key: MOVIES_STORE_KEY, storage: localStorage});
const api = new Backend(apiData);
const provider = new Provider({api, store});

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
    hideLoadMassage();
  })
  .catch(() => {
    erorMassage();
  });

const mainFunction = (filmsData) => {
  let filmCards = [];
  let filters = [];

  unrenderFilters();

  filmCards = createCardsData(filmsData, true);

  const activateFilmPopupCardCdb = (filmPopupCard) => {
    filmPopupCard.onSubmitComment = (id, comment) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].comments.push(comment);

      const filmCard = filmCards[filmCards.findIndex((it) => it.filmId === dataIndex.toString())];
      filmCard.reRender();

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    filmPopupCard.onUndoLastComment = (id, comments) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].comments = comments;

      const filmCard = filmCards[filmCards.findIndex((it) => it.filmId === dataIndex.toString())];
      filmCard.reRender();

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    filmPopupCard.onFilmDetailsChange = (id, newObject) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      let filter;
      let amount;

      if (newObject.isAlreadyWatched !== filmsData[dataIndex].isAlreadyWatched) {

        if (newObject.isAlreadyWatched === false) {
          filmsData[dataIndex].watchingDate = null;
        } else {
          filmsData[dataIndex].watchingDate = Date.now();
        }
        filmsData[dataIndex].isAlreadyWatched = newObject.isAlreadyWatched;

        filter = getHistoryFilter(filters);
        amount = filmsData.filter((it) => it.isAlreadyWatched === true).length;
      }

      if (newObject.isFavorite !== filmsData[dataIndex].isFavorite) {

        filmsData[dataIndex].isFavorite = newObject.isFavorite;

        filter = getFavoritesFilter(filters);
        amount = filmsData.filter((it) => it.isFavorite === true).length;
      }
      if (newObject.isWatchList !== filmsData[dataIndex].isWatchList) {

        filmsData[dataIndex].isWatchList = newObject.isWatchList;

        filter = getWatchListFilter(filters);
        amount = filmsData.filter((it) => it.isWatchList === true).length;
      }

      const filmCard = filmCards[filmCards.findIndex((it) => it.filmId === dataIndex.toString())];
      filmCard.update(filmsData[dataIndex]);
      filmCard.reRender();

      filter.update({amount});
      filter.reRender();

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    filmPopupCard.onScoreChange = (id, rating) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].userRate = rating;
      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    filmPopupCard.onClose = () => {
      filmPopupCard.unrender();
    };
  };


  const activateFilmCardsCb = (card, filmId) => {
    card.onComments = () => {
      const filmPopupCard = new FilmPopup(filmsData[filmId]);
      document.body.appendChild(filmPopupCard.render());
      activateFilmPopupCardCdb(filmPopupCard);
    };

    card.onMarkAsWatched = (state, id) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].isAlreadyWatched = state;
      if (state) {
        filmsData[dataIndex].watchingDate = Date.now();
      } else {
        filmsData[dataIndex].watchingDate = null;
      }
      card.reRender();

      const filter = filters[filters.findIndex((it) => it.id === `HistoryFilms`)];
      const amount = filmsData.filter((it) => it.isAlreadyWatched === true).length;
      filter.update({amount});
      filter.reRender();

      statisticComponent.getStatisticData(filmsData);

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    card.onAddToFavorite = (state, id) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].isFavorite = state;
      card.reRender();

      const filter = filters[filters.findIndex((it) => it.id === `FavoritesFilms`)];
      const amount = filmsData.filter((it) => it.isFavorite === true).length;
      filter.update({amount});
      filter.reRender();

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };

    card.onAddToWatchList = (state, id) => {
      const dataIndex = filmsData.findIndex((it) => it.id === id);
      filmsData[dataIndex].isWatchList = state;
      card.reRender();

      const filter = filters[filters.findIndex((it) => it.id === `WatchlistFilms`)];
      const amount = filmsData.filter((it) => it.isWatchList === true).length;
      filter.update({amount});
      filter.reRender();

      return provider.updateMovie({id, data: filmsData[dataIndex].toRaw()})
      .then(() => {
        renderExtraCardsBlock();
      });
    };
  };

  renderFilmCards(FILMS_LIST_MAIN, filmCards);

  const activateFilmCards = (cards) => {
    cards.forEach((it) => {
      const filmId = it.filmId;
      activateFilmCardsCb(it, filmId);
    });
  };

  activateFilmCards(filmCards);

  const renderExtraCardsBlock = () => {
    let topCommsData = null;
    let commentFilmCards = [];
    let topRateData = null;
    let topRatedFilmCards = [];

    topCommsData = getTopCommentData(filmsData);
    removeFilmCards(commentFilmCards);
    commentFilmCards = createCardsData(topCommsData);
    renderFilmCards(TOP_COMM_AREA, commentFilmCards);
    activateFilmCards(commentFilmCards);

    topRateData = getTopRatedData(filmsData);
    removeFilmCards(topRatedFilmCards);
    topRatedFilmCards = createCardsData(topRateData);
    renderFilmCards(TOP_RATE_AREA, topRatedFilmCards);
    activateFilmCards(topRatedFilmCards);
  };

  renderExtraCardsBlock();

  const renderFilters = (data) => {
    filters = createFilters(data);

    const onFilterClick = (id) => {
      removeFilmCards(filmCards);

      let filteredFilms;
      switch (id) {
        case `AllFilms`:
          showFilms();
          filteredFilms = filmsData;
          filmCards = createCardsData(filteredFilms, true);
          renderFilmCards(FILMS_LIST_MAIN, filmCards);
          activateFilmCards(filmCards);
          break;

        case `WatchlistFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isWatchList === true);
          filmCards = createCardsData(filteredFilms, true);
          renderFilmCards(FILMS_LIST_MAIN, filmCards);
          activateFilmCards(filmCards);
          break;

        case `HistoryFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isAlreadyWatched === true);
          filmCards = createCardsData(filteredFilms, true);
          renderFilmCards(FILMS_LIST_MAIN, filmCards);
          activateFilmCards(filmCards);
          break;

        case `FavoritesFilms`:
          showFilms();
          filteredFilms = filmsData.filter((it) => it.isFavorite === true);
          filmCards = createCardsData(filteredFilms, true);
          renderFilmCards(FILMS_LIST_MAIN, filmCards);
          activateFilmCards(filmCards);
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

  const renderStatsComponent = () => {
    statisticComponent = new Statistics(filmsData);
    statisticComponent.getStatisticData(filmsData);
    STISTIC_AREA.appendChild(statisticComponent.render());
    statisticComponent.statisticDiagram();
  };

  renderStatsComponent();

  const unrenderStatsComponent = () => {
    if (statisticComponent) {
      statisticComponent.unrender();
    }
  };

  const watchedMovies = filmsData.filter((it) => it[`isAlreadyWatched`] === true);

  if (watchedMovies.length < 11) {
    PROFILE_RATING_AREA.textContent = `novice`;
  }

  if (watchedMovies.length < 21 & filmsData.length > 10) {
    PROFILE_RATING_AREA.textContent = `fan`;
  }

  if (watchedMovies.length > 20) {
    PROFILE_RATING_AREA.textContent = `movie buff`;
  }

  document.querySelector(`.footer__statistics`).textContent = `${filmsData.length} movies inside`;

  const showMore = () => {
    if (SHOW_MORE_BUTTON.classList.contains(`visually-hidden`)) {
      SHOW_MORE_BUTTON.classList.remove(`visually-hidden`);
    }
    for (let i = 0; i < 5; i++) {
      if (FILMS_LIST_MAIN.querySelector(`.film-card--hidden`)) {
        const film = FILMS_LIST_MAIN.querySelector(`.film-card--hidden`);
        film.classList.remove(`film-card--hidden`, `visually-hidden`);
      } else {
        SHOW_MORE_BUTTON.classList.add(`visually-hidden`);
      }
    }
  };

  SHOW_MORE_BUTTON.addEventListener(`click`, showMore);
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
    filmCards = createCardsData(searchedArray, true);
    renderFilmCards(FILMS_LIST_MAIN, filmCards);
    activateFilmCards(filmCards);
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
