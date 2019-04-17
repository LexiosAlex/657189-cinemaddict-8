import Film from './film.js';

export const createCardsData = (data, deactivateControls) => {
  const filmCards = [];

  data.forEach((it) => {
    if (deactivateControls) {
      it.controlsDeactivate = false;
    }
    filmCards.push(new Film(it));
  });

  return filmCards;
};
