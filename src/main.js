import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import Statistics from './statistic.js';
import Filter from './filter.js';
import Backend from './backend.js';

const AUTHORIZATION = `Basic eo0w590ik56219a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const apiData = {endPoint: END_POINT, authorization: AUTHORIZATION};

const api = new Backend(apiData);

api.getMovie()
  .then((films) =>{
    mainFunction(films);
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

  const unrenderFilters = () => {
    let filterArray = FILTERS_AREA.querySelectorAll(`.main-navigation__item`);
    filterArray.forEach((item) => {
      FILTERS_AREA.removeChild(item);
    });
  };

  unrenderFilters();

  const createCardsData = (data) => {
    filmCards = [];
    filmPopupCards = [];
    for (let i = 0; i < data.length; i++) {
      filmCards[i] = new Film(data[i]);
      filmPopupCards[i] = new FilmPopup(data[i]);
    }
  };

  createCardsData(filmsData);


  const updateFiltersData = (filterId, state) => {
    const filterIndex = filtersData.findIndex((it) => it.id === filterId);
    if (state) {
      filtersData[filterIndex].amount++;
    } else {
      filtersData[filterIndex].amount--;
    }
  };

  const renderFilmCard = (data, area) => {
    for (let i = 0; i < filmCards.length; i++) {
      let filmCard = filmCards[i];
      let filmPopupElement = filmPopupCards[i];

      area.appendChild(filmCard.render());

      filmCard.onComments = () => {
        document.body.appendChild(filmPopupElement.render());
      };

      filmCard.onMarkAsWatched = (state, id) => {
        data[id].isAlreadyWatched = state;

        updateFiltersData(`HistoryFilms`, state);

        filmPopupElement.update(data[id]);
        filmCard.reRender();

        removeFilters(filters);
        renderFilters(filtersData);
        getStatsData();
      };

      filmCard.onAddToFavorite = (state, id) => {
        data[id].isFavorite = state;

        updateFiltersData(`FavoritesFilms`, state);

        filmPopupElement.update(data[id]);
        filmCard.reRender();

        removeFilters(filters);
        renderFilters(filtersData);
      };

      filmCard.onAddToWatchList = (state, id) => {
        data[id].isWatchList = state;

        updateFiltersData(`WatchlistFilms`, state);

        filmPopupElement.update(data[id]);
        filmCard.reRender();

        removeFilters(filters);
        renderFilters(filtersData);
      };

      filmPopupElement.onSubmitComment = (id, comment) => {
        data[id].comments.push(comment);

        return api.updateMovie({id, data: data[id].toRaw()});
      }

      filmPopupElement.onFilmDetailsChange = (id, newObject) => {
        if (newObject.isAlreadyWatched !== data[id].isAlreadyWatched) {
          updateFiltersData(`HistoryFilms`, newObject.isAlreadyWatched);
          data[id].isAlreadyWatched = newObject.isAlreadyWatched;
        }
        if (newObject.isFavorite !== data[id].isFavorite) {
          updateFiltersData(`FavoritesFilms`, newObject.isFavorite);
          data[id].isFavorite = newObject.isFavorite;
        }
        if (newObject.isWatchList !== data[id].isWatchList) {
          updateFiltersData(`WatchlistFilms`, newObject.isWatchList);
          data[id].isWatchList = newObject.isWatchList;
        }

        filmCard.update(data[id]);
        filmCard.reRender();

        removeFilters(filters);
        renderFilters(filtersData);

        return api.updateMovie({id, data: data[id].toRaw()});
      }

      filmPopupElement.onClose = () => {
        filmPopupElement.unrender();
      };

      filmPopupElement.onScoreChange = (id, rating) => {
        data[id].userRate = rating;

        return api.updateMovie({id, data: data[id].toRaw()});
      }
    }
  };

  const removeFilmCards = () => {
    for (let i = 0; i < filmCards.length; i++) {
      let filmCard = filmCards[i];

      filmCard.unrender();
    }
  };


  renderFilmCard(filmsData, FILMS_LIST_MAIN);

  const filters = [];

  const filmsArea = document.querySelector(`.films`);
  const statisticArea = document.querySelector(`.statistic`);

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

  const renderFilters = (data) => {
    for (let i = 0; i < data.length; i++) {
      filters[i] = new Filter(data[i]);
    }

    const filterAll = filters[data.findIndex((it) => it.id === `AllFilms`)];
    const filterWatchlistFilms = filters[data.findIndex((it) => it.id === `WatchlistFilms`)];
    const filterHistoryFilms = filters[data.findIndex((it) => it.id === `HistoryFilms`)];
    const filterFavoritesFilms = filters[data.findIndex((it) => it.id === `FavoritesFilms`)];
    const filterStats = filters[data.findIndex((it) => it.id === `Stats`)];

    FILTERS_AREA.appendChild(filterAll.render());
    FILTERS_AREA.appendChild(filterWatchlistFilms.render());
    FILTERS_AREA.appendChild(filterHistoryFilms.render());
    FILTERS_AREA.appendChild(filterFavoritesFilms.render());
    FILTERS_AREA.appendChild(filterStats.render());


    const deActivateAll = () => {
      data.forEach((it) =>{
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
      removeFilmCards();
      createCardsData(filteredArray);
      renderFilmCard(filmsData, FILMS_LIST_MAIN);
      deActivateAll();
      dataFilter[dataFilter.findIndex((it) => it.id === filterId)].active = true;
      filterName.activate();
      updateAll();
    };

    filterAll.onFilterClick = () => {
      showFilms();
      removeFilmCards();
      createCardsData(filmsData);
      renderFilmCard(filmsData, FILMS_LIST_MAIN);
      deActivateAll();
      filterAll.activate();
      data[data.findIndex((it) => it.id === `AllFilms`)].active = true;
      updateAll();
    };

    filterWatchlistFilms.onFilterClick = () => {
      filterActivate(filterWatchlistFilms, data, `WatchlistFilms`, `isWatchList`);
    };

    filterHistoryFilms.onFilterClick = () => {
      filterActivate(filterHistoryFilms, data, `HistoryFilms`, `isAlreadyWatched`);
    };

    filterFavoritesFilms.onFilterClick = () => {
      filterActivate(filterFavoritesFilms, data, `FavoritesFilms`, `isFavorite`);
    };

    filterStats.onFilterClick = () => {
      hideFilms();
      deActivateAll();
      filterStats.activate();
      updateAll();
      unrenderStatsComponent();
      renderStatsComponent();
    };
  };

  renderFilters(filtersData);

  const removeFilters = (filtersArr) => {
    filtersArr.forEach((it) =>{
      it.unrender();
    });
  };

  let statisticComponent = null;

  const getStatsData = () => {
    const statsData = {};
    const historyArray = filmsData.filter((it) => it.isAlreadyWatched === true);

    let totalMins = 0;

    historyArray.forEach((it) =>{
      totalMins += it.duration;
    });

    let genresSet = new Set([]);

    historyArray.forEach((it) => {
      it.genres.forEach((genre) => {
        genresSet.add(genre);
      });
    });

    let genresArray = [];
    genresSet.forEach((setGenre) =>{
      let genreObject = {};
      genreObject.genre = setGenre;
      genreObject.count = 0;
      historyArray.filter((it) => {
        it.genres.forEach((elem) => {
          if (setGenre === elem) {
            genreObject.count++;
          }
        });
      });
      genresArray.push(genreObject);
    });

    genresArray.sort((a, b) => {
      return b.count - a.count;
    });

    let genres = [];
    let genresCount = [];
    genresArray.forEach((it) => {
      genres.push(it.genre);
      genresCount.push(it.count);
    });

    statsData.genresCount = genresCount;
    statsData.genres = genres;
    statsData.totaltime = totalMins;
    statsData.moviesCount = historyArray.length;

    return statsData;
  };

  const renderStatsComponent = () => {
    const statsData = getStatsData();
    statisticComponent = new Statistics(statsData);
    statisticArea.appendChild(statisticComponent.render());
    statisticComponent.statisticDiagram();
  };

  renderStatsComponent();

  const unrenderStatsComponent = () => {
    if (statisticComponent) {
      statisticComponent.unrender();
    }
  };
};
