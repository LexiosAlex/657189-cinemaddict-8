export const removeFilmCards = (cards) => {
  for (const filmCard of cards) {
    filmCard.unrender();
  }
};
