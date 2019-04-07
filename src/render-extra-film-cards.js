import renderFilmCard from './render-film-card.js';
import Film from './film.js';
import FilmPopup from './film-popup.js';
import {removeFilmCards} from './remove-film-cards.js';

const topCommmArea = document.querySelector(`.films-list__container--top-commented`);
const topRatedArea = document.querySelector(`.films-list__container--top-rated`);
let topCommsData = null;
let commentFilmCards = [];
let commentFilmPopupCards = [];
let topRateData = null;
let topRatedFilmCards = [];
let topRatedFilmsPopupCards = [];

export const getTopCommentData = (data) => {
  const topCommentSort = data.slice();
  topCommentSort.sort((a, b) => {
    return b.comments.length - a.comments.length;
  });

  topCommentSort.forEach((it) => {
    it.controlsDeactivate = true;
  });

  topCommsData = topCommentSort.slice(0, 2);
};

export const renderTopComments = (filmsData) => {
  removeFilmCards(commentFilmCards);
  commentFilmCards = [];
  commentFilmPopupCards = [];
  topCommsData.forEach((it) => {
    commentFilmCards.push(new Film(it));
    commentFilmPopupCards.push(new FilmPopup(it));
  });
  renderFilmCard(topCommsData, topCommmArea, commentFilmCards, commentFilmPopupCards, `main`, filmsData);
}


export const getTopRatedData = (data) => {
  const topRatedSort = data.slice();
  topRatedSort.sort((a, b) => {
    return b.rating - a.rating;
  });

  topRatedSort.forEach((it) => {
    it.controlsDeactivate = true;
  });

  topRateData = topRatedSort.slice(0, 2);
};

export const renderTopRated = (filmsData) => {
  removeFilmCards(topRatedFilmCards);
  topRatedFilmCards = [];
  topRatedFilmsPopupCards = [];
  topRateData.forEach((it) => {
    topRatedFilmCards.push(new Film(it));
    topRatedFilmsPopupCards.push(new FilmPopup(it));
  });
  renderFilmCard(topRateData, topRatedArea, topRatedFilmCards, topRatedFilmsPopupCards, `main`, filmsData);
}
