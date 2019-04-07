export const removeFilmCards = (filmCards) => {
  for (let i = 0; i < filmCards.length; i++) {
    let filmCard = filmCards[i];

    filmCard.unrender();
  }
};
