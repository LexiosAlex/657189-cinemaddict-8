import {FILTERS_AREA, ALL_FILMS_AREA, FILMS_LIST_MAIN} from './export-const.js';
import renderFilter from './render-filter.js';
import CreateFilmCard from './film.js';
import FilmPopup from './film-popup.js';

const filterElements = [
  {
    id: `All`,
    caption: `All movies`,
    active: true
  },
  {
    id: `Watchlist`,
    caption: `Watchlist`,
    amount: 13
  },
  {
    id: `History`,
    caption: `History`,
    amount: 4
  },
  {
    id: `Favorites`,
    caption: `Favorites`,
    amount: 8
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

const renderFilmCard = (count, area) => {
  for (let i = 0; i < count; i++) {

    const getDescription = (times) => {
      let stringArray = [];
      for (let j = 0; j < times; j++) {
        stringArray[j] = DescriptionSentenses[Math.floor(Math.random() * DescriptionSentenses.length)];
      }
      return stringArray.join(` `);
    };

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
    let filmCard = new CreateFilmCard(filmExample);
    let filmPopupElement = new FilmPopup(filmExample);
    area.appendChild(filmCard.render());

    filmCard.onComments = () => {
      document.body.appendChild(filmPopupElement.render());
    };

    filmPopupElement.onClose = () => {
      filmPopupElement.unrender();
    };
    filmPopupElement.onSubmit = (newObject) => {
      filmExample.isAlreadyWatched = newObject.isAlreadyWatched;
      filmExample.isFavorite = newObject.isFavorite;
      filmExample.isWatchList = newObject.isWatchList;
      filmCard.update(filmExample);
      filmCard.reRender();
    };
  }
};


ALL_FILMS_AREA.forEach((item) => {
  renderFilmCard(2, item);
});

renderFilmCard(5, FILMS_LIST_MAIN);

const removeFilmCards = () => {
  let filmsArray = FILMS_LIST_MAIN.querySelectorAll(`.film-card`);
  filmsArray.forEach((item) => {
    FILMS_LIST_MAIN.removeChild(item);
  });
};

FILTERS_AREA.querySelectorAll(`.main-navigation__item`).forEach((item) => {
  item.addEventListener(`click`, () => {
    removeFilmCards();
    let randomValue = Math.floor(Math.random() * 10);
    renderFilmCard(randomValue, ALL_FILMS_AREA[0]);
  });
});
