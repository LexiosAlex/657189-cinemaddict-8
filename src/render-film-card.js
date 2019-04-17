export const renderFilmCard = (area, mainFilmCards) => {
  for (const filmCard of mainFilmCards) {
    area.appendChild(filmCard.render());
  }
};

export const removeFilmCards = (cards) => {
  for (const filmCard of cards) {
    filmCard.unrender();
  }
};
