import Film from './film.js';

export const createCardsData = (data, deactivateControls) => {
  const filmCards = [];

  data.forEach((it) => {
    it.controlsDeactivate = !deactivateControls;
    filmCards.push(new Film(it));
  });

  return filmCards;
};
