import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Component from './component.js';
const noviceRankLength = 10;
const fanRankLength = 20;
const SECOND_DURATION = 1000;
const DAY_DURATION = 86400;
const WEEK_DURATION = 604800;
const MONTH_DURATION = 2592000;
const YEAR_DURATION = 31536000;
const HOUR_DURATION = 60;

export default class Statistic extends Component {
  constructor(data) {
    super();

    this._filmsData = data;
    this._historyArray = null;
    this._totalTime = null;
    this._genresCount = null;
    this._genres = null;
    this._moviesCount = null;
    this._onStatisticFilterClick = this._onStatisticFilterClick.bind(this);
    this._element = null;

    this._filtersState = new Map([
      [`allTime`, true],
    ]);
  }

  getStatisticData(filmsData) {
    this._historyArray = filmsData.filter((it) => it.isAlreadyWatched === true);

    this._totalTime = 0;

    this._historyArray.forEach((it) =>{
      this._totalTime += it.duration;
    });

    let genresSet = new Set([]);

    this._historyArray.forEach((it) => {
      it.genres.forEach((genre) => {
        genresSet.add(genre);
      });
    });

    let genresArray = [];
    genresSet.forEach((setGenre) =>{
      let genreObject = {};
      genreObject.genre = setGenre;
      genreObject.count = 0;
      this._historyArray.filter((it) => {
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

    this._genres = [];
    this._genresCount = [];
    genresArray.forEach((it) => {
      this._genres.push(it.genre);
      this._genresCount.push(it.count);
    });

    this._moviesCount = this._historyArray.length;
  }

  _onStatisticFilterClick(evt) {
    let filteredArray = [];
    switch (evt.target.value) {
      case (`all-time`):
        this._filtersState.clear();
        this._filtersState.set(`allTime`, true);
        this.getStatisticData(this._filmsData);
        this.reRender();
        this.statisticDiagram();
        break;
      case (`today`):
        this._filmsData.forEach((it) => {
          if ((Date.now() - it.watchingDate) / SECOND_DURATION < DAY_DURATION) {
            filteredArray.push(it);
          }
        });
        this._filtersState.clear();
        this._filtersState.set(`today`, true);
        this.getStatisticData(filteredArray);
        this.reRender();
        this.statisticDiagram();
        break;

      case (`week`):
        this._filmsData.forEach((it) => {
          if ((Date.now() - it.watchingDate) / SECOND_DURATION < WEEK_DURATION) {
            filteredArray.push(it);
          }
        });
        this._filtersState.clear();
        this._filtersState.set(`week`, true);
        this.getStatisticData(filteredArray);
        this.reRender();
        this.statisticDiagram();
        break;

      case (`month`):
        this._filmsData.forEach((it) => {
          if ((Date.now() - it.watchingDate) / SECOND_DURATION < MONTH_DURATION) {
            filteredArray.push(it);
          }
        });
        this._filtersState.clear();
        this._filtersState.set(`month`, true);
        this.getStatisticData(filteredArray);
        this.reRender();
        this.statisticDiagram();
        break;

      case (`year`):
        this._filmsData.forEach((it) => {
          if ((Date.now() - it.watchingDate) / SECOND_DURATION < YEAR_DURATION) {
            filteredArray.push(it);
          }
        });
        this._filtersState.clear();
        this._filtersState.set(`year`, true);
        this.getStatisticData(filteredArray);
        this.reRender();
        this.statisticDiagram();
        break;
    }
  }

  get template() {

    let userRank = `undefined`;

    if (this._filmsData.length <= noviceRankLength) {
      userRank = `novice`;
    }

    if (this._filmsData.length <= fanRankLength & this._filmsData.length > noviceRankLength) {
      userRank = `fan`;
    }

    if (this._filmsData.length > fanRankLength) {
      userRank = `movie buff`;
    }


    return `
    <div>
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">${userRank}</span></p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time"${this._filtersState.get(`allTime`) ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today"${this._filtersState.get(`today`) ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week"${this._filtersState.get(`week`) ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month"${this._filtersState.get(`month`) ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year"${this._filtersState.get(`year`) ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._moviesCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${Math.floor(this._totalTime / HOUR_DURATION)} <span class="statistic__item-description">h</span> ${(this._totalTime - Math.floor(this._totalTime / HOUR_DURATION) * HOUR_DURATION)} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._genres[0]}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </div>`.trim();
  }

  statisticDiagram() {
    const statisticCtx = this._element.querySelector(`.statistic__chart`).getContext(`2d`);
    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * 5;
    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._genres,
        datasets: [{
          data: this._genresCount,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
    return myChart;
  }

  bind() {
    this.element.querySelectorAll(`.statistic__filters-input`)
      .forEach((it) => {
        it.addEventListener(`click`, this._onStatisticFilterClick);
      });
  }

  unbind() {
    this.element.querySelectorAll(`.statistic__filters-input`)
      .forEach((it) => {
        it.removeEventListener(`click`, this._onStatisticFilterClick);
      });
  }

  reRender() {
    this.unbind();
    this._particularUpdate();
    this.bind();
  }
}


