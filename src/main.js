import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import CreateFilmCard from './film.js';
import FilmPopup from './film-popup.js';
import Statistics from './statistic.js';
import CreateFilter from './filter.js';

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
  if (data.length !== 0) {
    for (let i = 0; i < data.length; i++) {
      filmCards[i] = new CreateFilmCard(data[i]);
      filmPopupCards[i] = new FilmPopup(data[i]);
    }
  }
};

createCardsData(mockData);

const renderFilmCard = (data, area) => {
  for (let i = 0; i < filmCards.length; i++) {
    let filmCard = filmCards[i];
    let filmPopupElement = filmPopupCards[i];
    let dataId = null;

    filmCard.getId = (id) => {
      dataId = id;
    };

    area.appendChild(filmCard.render());

    filmCard.onComments = () => {
      document.body.appendChild(filmPopupElement.render());
    };

    filmCard.onMarkAsWatched = (state) => {
      data[dataId].isAlreadyWatched = state;

      const filterIndex = filtersData.findIndex((it) => it.id === `HistoryFilms`);
      if (state) {
        filtersData[filterIndex].amount++;
      } else {
        filtersData[filterIndex].amount--;
      }

      filmPopupElement.update(data[dataId]);
      filmCard.reRender();

      removeFilters(filtersArray);
      renderFilters(filtersData);
    };

    filmCard.onAddToFavorite = (state) => {
      data[dataId].isFavorite = state;

      const filterIndex = filtersData.findIndex((it) => it.id === `FavoritesFilms`);
      if (state) {
        filtersData[filterIndex].amount++;
      } else {
        filtersData[filterIndex].amount--;
      }

      filmPopupElement.update(data[dataId]);
      filmCard.reRender();

      removeFilters(filtersArray);
      renderFilters(filtersData);
    };

    filmCard.onAddToWatchList = (state) => {
      data[dataId].isWatchList = state;

      const filterIndex = filtersData.findIndex((it) => it.id === `WatchlistFilms`);
      if (state) {
        filtersData[filterIndex].amount++;
      } else {
        filtersData[filterIndex].amount--;
      }

      filmPopupElement.update(data[dataId]);
      filmCard.reRender();

      removeFilters(filtersArray);
      renderFilters(filtersData);
    };

    filmPopupElement.onClose = () => {
      filmPopupElement.unrender();
    };

    filmPopupElement.onSubmit = (newObject) => {
      data[dataId].isAlreadyWatched = newObject.isAlreadyWatched;
      data[dataId].isFavorite = newObject.isFavorite;
      data[dataId].isWatchList = newObject.isWatchList;
      filmCard.update(data[dataId]);
      filmCard.reRender();
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

const filtersArray = [];

const renderFilters = (data) => {
  for (let i = 0; i < data.length; i++) {
    filtersArray[i] = new CreateFilter(data[i]);
  }

  const filterAll = filtersArray[data.findIndex((it) => it.id === `AllFilms`)];
  const filterWatchlistFilms = filtersArray[data.findIndex((it) => it.id === `WatchlistFilms`)];
  const filterHistoryFilms = filtersArray[data.findIndex((it) => it.id === `HistoryFilms`)];
  const filterFavoritesFilms = filtersArray[data.findIndex((it) => it.id === `FavoritesFilms`)];
  const filterStats = filtersArray[data.findIndex((it) => it.id === `Stats`)];

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
    filterAll.reRender();
    filterAll.unrender();
    FILTERS_AREA.appendChild(filterAll.render());

    filterWatchlistFilms.reRender();
    filterWatchlistFilms.unrender();
    FILTERS_AREA.appendChild(filterWatchlistFilms.render());

    filterHistoryFilms.reRender();
    filterHistoryFilms.unrender();
    FILTERS_AREA.appendChild(filterHistoryFilms.render());

    filterFavoritesFilms.reRender();
    filterFavoritesFilms.unrender();
    FILTERS_AREA.appendChild(filterFavoritesFilms.render());

    filterStats.reRender();
    filterStats.unrender();
    FILTERS_AREA.appendChild(filterStats.render());
  };

  filterAll.onFilterClick = () => {
    removeFilmCards();
    createCardsData(mockData);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
    deActivateAll();
    filterAll.activate();
    data[data.findIndex((it) => it.id === `AllFilms`)].active = true;
    updateAll();
  };

  filterWatchlistFilms.onFilterClick = () => {
    const watchListFiltered = mockData.filter((it) => it.isWatchList === true);
    removeFilmCards();
    createCardsData(watchListFiltered);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
    deActivateAll();
    data[data.findIndex((it) => it.id === `WatchlistFilms`)].active = true;
    filterWatchlistFilms.activate();
    updateAll();
  };

  filterHistoryFilms.onFilterClick = () => {
    const historyFiltered = mockData.filter((it) => it.isAlreadyWatched === true);
    removeFilmCards();
    createCardsData(historyFiltered);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
    deActivateAll();
    data[data.findIndex((it) => it.id === `HistoryFilms`)].active = true;
    filterHistoryFilms.activate();
    updateAll();
  };

  filterFavoritesFilms.onFilterClick = () => {
    const favoriteFiltered = mockData.filter((it) => it.isFavorite === true);
    removeFilmCards();
    createCardsData(favoriteFiltered);
    renderFilmCard(mockData, FILMS_LIST_MAIN);
    deActivateAll();
    data[data.findIndex((it) => it.id === `FavoritesFilms`)].active = true;
    filterFavoritesFilms.activate();
    updateAll();
  };

  filterStats.onFilterClick = () => {
    deActivateAll();
    filterStats.activate();
    updateAll();
  };
};

renderFilters(filtersData);

const removeFilters = (filters) => {
  filters.forEach((it) =>{
    it.unrender();
  });
};

const getStatisticData = (data) => {

};

getStatisticData(mockData);
