import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import Statistics from './statistic.js';
import Filter from './filter.js';

const filtersData = [
  {
    id: `AllFilms`,
    caption: `All movies`,
    active: true
  },
  {
    id: `WatchlistFilms`,
    caption: `Watchlist`,
    amount: 0,
    active: false
  },
  {
    id: `HistoryFilms`,
    caption: `History`,
    amount: 0,
    active: false
  },
  {
    id: `FavoritesFilms`,
    caption: `Favorites`,
    amount: 0,
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

const getRandomComment = (count) => {
  const EmojiList = [`sleeping`, `neutral-face`, `grinning`];

  const commentsList = [];

  for (let i = 0; i < count; i++) {
    const comment = {
      text: `mock comment auto add`,
      emoji: EmojiList[Math.floor(Math.random() * 3)],
      author: `Ermak Lolotov`,
      addDate: new Date(Date.now() - (Math.random() * 24 * (7) * 1000 * 60 * 60)),
    };
    commentsList[i] = comment;
  }
  return commentsList;
};

const films = [`Shrek2`, `The movie`, `Shrek3`, `Robocop`, `My cop`, `Warcraft`, `Breaking Bad`, `Banshi`, `Skyline`, `Loot`, `Bullets`, `Tape`, `Battle Angel`, `Napoleon`];
const posterPhotos = [`three-friends.jpg`, `accused.jpg`, `blackmail.jpg`, `blue-blazes.jpg`, `fuga-da-new-york.jpg`, `moonrise.jpg`];
const DescriptionSentenses = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const getDescription = (times) => {
  let stringArray = [];
  for (let j = 0; j < times; j++) {
    stringArray[j] = DescriptionSentenses[Math.floor(Math.random() * DescriptionSentenses.length)];
  }
  return stringArray.join(` `);
};

const mockDate = (count) => {
  const mockArray = [];
  for (let i = 0; i < count; i++) {
    const filmExample = {
      id: i,
      filmTitle: films[Math.floor(Math.random() * films.length)],
      originalTitle: `MOCK ORIGINAL TITLE`,
      actors: new Set([
        `Nikolas Cage`,
        `Angelina Jolie`,
        `Johnny Depp`,
      ]),
      rating: (Math.random() * 10).toFixed(1),
      ageRating: `18`,
      year: new Date(Math.random() * 3600 * 1000 * 24 * 365 * 45),
      duration: Math.floor(Math.random() * 200),
      genres: new Set([
        `fantasy`,
        `detective`,
        `battle`,
        `romantic`,
      ]),
      episodes: ``,
      country: `USA`,
      releaseDate: ``,
      digitalRelease: ``,
      poster: `./images/posters/${posterPhotos[Math.floor(Math.random() * posterPhotos.length)]}`,
      description: getDescription(Math.floor(Math.random() * 2 + 1)),
      comments: getRandomComment(3),
      isAlreadyWatched: false,
      isFavorite: false,
      isWatchList: false,
    };
    mockArray.push(filmExample);
  }
  return mockArray;
};

const mockData = mockDate(8);

let filmCards = [];
let filmPopupCards = [];

const createCardsData = (data) => {
  filmCards = [];
  filmPopupCards = [];
  for (let i = 0; i < data.length; i++) {
    filmCards[i] = new Film(data[i]);
    filmPopupCards[i] = new FilmPopup(data[i]);
  }
};

createCardsData(mockData);


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
    let id = null;

    area.appendChild(filmCard.render());

    filmCard.onComments = (dataId) => {
      id = dataId;
      document.body.appendChild(filmPopupElement.render());
    };

    filmCard.onMarkAsWatched = (state, dataId) => {
      id = dataId;
      data[id].isAlreadyWatched = state;

      updateFiltersData(`HistoryFilms`, state);

      filmPopupElement.update(data[id]);
      filmCard.reRender();

      removeFilters(filters);
      renderFilters(filtersData);
      getStatsData();
    };

    filmCard.onAddToFavorite = (state, dataId) => {
      id = dataId;
      data[id].isFavorite = state;

      updateFiltersData(`FavoritesFilms`, state);

      filmPopupElement.update(data[id]);
      filmCard.reRender();

      removeFilters(filters);
      renderFilters(filtersData);
    };

    filmCard.onAddToWatchList = (state, dataId) => {
      id = dataId;
      data[id].isWatchList = state;

      updateFiltersData(`WatchlistFilms`, state);

      filmPopupElement.update(data[id]);
      filmCard.reRender();

      removeFilters(filters);
      renderFilters(filtersData);
    };

    filmPopupElement.onClose = () => {
      filmPopupElement.unrender();
    };

    filmPopupElement.onSubmit = (newObject, dataId) => {
      id = dataId;
      const watchedState = data[id].isAlreadyWatched;
      const favoriteState = data[id].isFavorite;
      const watchlistState = data[id].isWatchList;

      data[id].isAlreadyWatched = newObject.isAlreadyWatched;
      data[id].isFavorite = newObject.isFavorite;
      data[id].isWatchList = newObject.isWatchList;

      if (data[id].isAlreadyWatched === !watchedState) {
        updateFiltersData(`HistoryFilms`, newObject.isAlreadyWatched);
      }
      if (data[id].isFavorite === !favoriteState) {
        updateFiltersData(`FavoritesFilms`, newObject.isFavorite);
      }
      if (data[id].isWatchList === !watchlistState) {
        updateFiltersData(`WatchlistFilms`, newObject.isWatchList);
      }

      filmCard.update(data[id]);
      filmCard.reRender();

      removeFilters(filters);
      renderFilters(filtersData);
    };
  }
};

const removeFilmCards = () => {
  for (let i = 0; i < filmCards.length; i++) {
    let filmCard = filmCards[i];

    filmCard.unrender();
  }
};


renderFilmCard(mockData, FILMS_LIST_MAIN);

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
    const filteredArray = mockData.filter((it) => it[stateName] === true);
    removeFilmCards();
    createCardsData(filteredArray);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
    deActivateAll();
    dataFilter[dataFilter.findIndex((it) => it.id === filterId)].active = true;
    filterName.activate();
    updateAll();
  };

  filterAll.onFilterClick = () => {
    showFilms();
    removeFilmCards();
    createCardsData(mockData);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
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
  const historyArray = mockData.filter((it) => it.isAlreadyWatched === true);

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
  genresArray.reverse().forEach((it) => {
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
