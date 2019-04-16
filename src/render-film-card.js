export const renderFilmCard = (area, mainFilmCards) => {
  for (const filmCard of mainFilmCards) {
    area.appendChild(filmCard.render());
  }
};
