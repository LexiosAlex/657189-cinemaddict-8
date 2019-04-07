import {updateFiltersData, removeFilters, renderFilters} from './filters.js';
import {getStatsData} from './statistics.js';
import Backend from './backend.js';

const AUTHORIZATION = `Basic eo0w590ik56219a`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const apiData = {endPoint: END_POINT, authorization: AUTHORIZATION};
const api = new Backend(apiData);

export default (data, area, mainFilmCards, mainFilmPopupCards, whichCardsUpdate, filmsData) => {
  for (let i = 0; i < data.length; i++) {
    let filmCard = mainFilmCards[i];
    let filmPopupElement = mainFilmPopupCards[i];

    area.appendChild(filmCard.render());

    const rerenderCards = () => {
      // if (whichCardsUpdate === `main`) {
      //   removeFilmCards(filmCards);
      //   createCardsData(filmsData);
      //   renderFilmCard(filmsData, FILMS_LIST_MAIN, filmCards, filmPopupCards, `extra`, filmCards);
      // }

      // if (whichCardsUpdate === `extra`) {
      //   removeFilmCards(commentFilmCards);
      //   getTopCommentData(filmsData);
      //   renderExtraFilms(topCommsData, topCommmArea, commentFilmCards, commentFilmPopupCards);
      //   removeFilmCards(topRatedFilmCards);
      //   getTopRatedData(filmsData);
      //   renderExtraFilms(topRateData, topRatedArea, topRatedFilmCards, topRatedFilmsPopupCards);
      // }
    };

    filmCard.onComments = () => {
      document.body.appendChild(filmPopupElement.render());
    };

    filmCard.onMarkAsWatched = (state, id) => {
      const dataIndex = data.findIndex((it) => it.id === id);
      data[dataIndex].isAlreadyWatched = state;

      updateFiltersData(`HistoryFilms`, state);
      filmPopupElement.update(data[dataIndex]);
      filmCard.reRender();

      removeFilters();
      renderFilters(filmsData);
      getStatsData(filmsData);


      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
      });
    };

    filmCard.onAddToFavorite = (state, id) => {
      const dataIndex = data.findIndex((it) => it.id === id);
      data[dataIndex].isFavorite = state;

      updateFiltersData(`FavoritesFilms`, state);

      filmPopupElement.update(data[dataIndex]);
      filmCard.reRender();

      removeFilters();
      renderFilters(filmsData);

      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
      });
    };

    filmCard.onAddToWatchList = (state, id) => {
      const dataIndex = data.findIndex((it) => it.id === id);
      data[dataIndex].isWatchList = state;

      updateFiltersData(`WatchlistFilms`, state);

      filmPopupElement.update(data[dataIndex]);
      filmCard.reRender();

      removeFilters();
      renderFilters(filmsData);

      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
      });
    };

    filmPopupElement.onSubmitComment = (id, comment) => {
      const dataIndex = data.findIndex((it) => it.id === id);
      data[dataIndex].comments.push(comment);

      filmCard.reRender();
      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
        // showMore();
      });
    };

    filmPopupElement.onFilmDetailsChange = (id, newObject) => {

      const dataIndex = data.findIndex((it) => it.id === id);

      if (newObject.isAlreadyWatched !== data[dataIndex].isAlreadyWatched) {
        updateFiltersData(`HistoryFilms`, newObject.isAlreadyWatched);
        data[dataIndex].isAlreadyWatched = newObject.isAlreadyWatched;
      }
      if (newObject.isFavorite !== data[dataIndex].isFavorite) {
        updateFiltersData(`FavoritesFilms`, newObject.isFavorite);
        data[dataIndex].isFavorite = newObject.isFavorite;
      }
      if (newObject.isWatchList !== data[dataIndex].isWatchList) {
        updateFiltersData(`WatchlistFilms`, newObject.isWatchList);
        data[dataIndex].isWatchList = newObject.isWatchList;
      }

      filmCard.update(data[dataIndex]);
      filmCard.reRender();


      removeFilters();
      renderFilters(filmsData);
      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
        // showMore();
      });
    };

    filmPopupElement.onClose = () => {
      filmPopupElement.unrender();
    };

    filmPopupElement.onScoreChange = (id, rating) => {

      const dataIndex = data.findIndex((it) => it.id === id);
      data[dataIndex].userRate = rating;

      return api.updateMovie({id, data: data[dataIndex].toRaw()})
      .then(() => {
        rerenderCards(whichCardsUpdate);
        // showMore();
      });
    };
  }
};
