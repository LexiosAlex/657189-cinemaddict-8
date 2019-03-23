import {FILTERS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import renderFilter from './render-filter.js';
import CreateFilmCard from './film.js';
import FilmPopup from './film-popup.js';

const filterElements = [
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

const removeFilters = () => {
  let filterArray = FILTERS_AREA.querySelectorAll(`.main-navigation__item`);
  filterArray.forEach((item) => {
    FILTERS_AREA.removeChild(item);
  });
};

removeFilters();
renderFilter(filterElements);

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


    area.appendChild(filmCard.render());

    filmCard.onComments = () => {
      document.body.appendChild(filmPopupElement.render());
    };

    filmCard.onMarkAsWatched = (state) => {
      data[i].isAlreadyWatched = state;
      filmPopupElement.update(data[i]);
      filmCard.reRender();
    };

    filmCard.onAddToFavorite = (state) => {
      data[i].isFavorite = state;
      filmPopupElement.update(data[i]);
      filmCard.reRender();
    };

    filmCard.onAddToWatchList = (state) => {
      data[i].isWatchList = state;
      filmPopupElement.update(data[i]);
      filmCard.reRender();
    };

    filmPopupElement.onClose = () => {
      filmPopupElement.unrender();
    };

    filmPopupElement.onSubmit = (newObject) => {
      data[i].isAlreadyWatched = newObject.isAlreadyWatched;
      data[i].isFavorite = newObject.isFavorite;
      data[i].isWatchList = newObject.isWatchList;
      filmCard.update(data[i]);
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


FILTERS_AREA.querySelectorAll(`.main-navigation__item`).forEach((item) => {
  item.addEventListener(`click`, (filterName) => {
    switch (filterName.srcElement.id) {
      case `allfilms`:
        removeFilmCards();
        createCardsData(mockData);
        renderFilmCard(mockData, FILMS_LIST_MAIN);
        return;

      case `watchlistfilms`:
        const watchListFiltered = mockData.filter((it) => it.isWatchList === true);
        removeFilmCards();
        createCardsData(watchListFiltered);
        renderFilmCard(mockData, FILMS_LIST_MAIN);
        return;

      case `historyfilms`:
        const historyFiltered = mockData.filter((it) => it.isAlreadyWatched === true);
        removeFilmCards();
        createCardsData(historyFiltered);
        renderFilmCard(mockData, FILMS_LIST_MAIN);
        return;

      case `favoritesfilms`:

        const favoriteFiltered = mockData.filter((it) => it.isFavorite === true);
        removeFilmCards();
        createCardsData(favoriteFiltered);
        renderFilmCard(mockData, FILMS_LIST_MAIN);
        return;
    }
  });
});
