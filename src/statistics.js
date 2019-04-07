import Statistic from './statistic.js';

const statisticArea = document.querySelector(`.statistic`);
let statisticComponent = null;
let statsData = {};

export const getStatsData = (filmsData) => {
  statsData = {};
  const historyArray = filmsData.filter((it) => it.isAlreadyWatched === true);

  let totalMins = 0;

  historyArray.forEach((it) =>{
    totalMins += it.duration;
  });

  let genresSet = new Set([]);

  historyArray.forEach((it) => {
    it.genres.forEach((genre) => {
      genresSet.add(genre);
    });
  });

  let genresArray = [];
  genresSet.forEach((setGenre) =>{
    let genreObject = {};
    genreObject.genre = setGenre;
    genreObject.count = 0;
    historyArray.filter((it) => {
      it.genres.forEach((elem) => {
        if (setGenre === elem) {
          genreObject.count++;
        }
      });
    });
    genresArray.push(genreObject);
  });

  genresArray.sort((a, b) => {
    return b.count - a.count;
  });

  let genres = [];
  let genresCount = [];
  genresArray.forEach((it) => {
    genres.push(it.genre);
    genresCount.push(it.count);
  });

  statsData.genresCount = genresCount;
  statsData.genres = genres;
  statsData.totaltime = totalMins;
  statsData.moviesCount = historyArray.length;
};

export const renderStatsComponent = () => {
  statisticComponent = new Statistic(statsData);
  statisticArea.appendChild(statisticComponent.render());
  statisticComponent.statisticDiagram();
};

export const unrenderStatsComponent = () => {
  if (statisticComponent) {
    statisticComponent.unrender();
  }
};
