import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {render, unrender} from '../util';
import {Stat} from '../components/stat';
import {StatInfo} from '../components/stat-info';

class StatController {
  constructor(container, films, rank) {
    this._container = container;
    this._films = films;
    this._rank = rank;
    this._stat = new Stat(this._rank);
    this._statInfo = new StatInfo(this._films);
    this._chart = null;
  }

  _getChartLabels(films) {
    return films.reduce((genres, film) => {
      film.genres.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      });

      return genres;
    }, []);
  }

  _getChartData(films, labels) {
    return films.reduce((counts, film) => {
      labels.forEach((label, i) => {
        if (film.genres.has(label)) {
          counts[i]++;
        }
      });

      return counts;
    }, new Array(labels.length).fill(0));
  }

  _updateChart(labels, data) {
    this._chart.data.labels = labels;
    this._chart.data.datasets[0].data = data;
    this._chart.update();
  }

  show() {
    render(this._container, this._stat.getElement());
  }

  hide() {
    unrender(this._stat.getElement());
  }

  init() {
    const statEl = this._stat.getElement();
    const chartEl = statEl.querySelector(`.statistic__chart`);
    const filterEl = statEl.querySelector(`.statistic__filters`);
    const labels = this._getChartLabels(this._films);
    const data = this._getChartData(this._films, labels);

    this._chart = new Chart(chartEl, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `rgba(255, 232, 0)`,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            color: `#fff`,
            offset: 30,
            align: `left`,
            clamp: true,
            anchor: `start`,
            font: {
              size: 16,
            },
          },
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
          }],
          yAxes: [{
            barThickness: 30,
            ticks: {
              fontSize: 16,
              fontColor: `#ffffff`,
              padding: 60,
            },
          }],
        },
      },
    });

    filterEl.addEventListener(`change`, (evt) => {
      const {id} = evt.target;
      const year = moment().year();
      const month = moment().month();
      const week = moment().week();
      const dayOfYear = moment().dayOfYear();
      const statInfoEl = this._statInfo.getElement();
      let filtered = [];

      switch (id) {
        case `statistic-all-time`:
          filtered = this._films;
          break;
        case `statistic-today`:
          filtered = this._films.filter(({user: {watchingDate}}) => {
            return moment(watchingDate).year() === year && moment(watchingDate).dayOfYear() === dayOfYear;
          });

          break;
        case `statistic-week`:
          filtered = this._films.filter(({user: {watchingDate}}) => {
            return moment(watchingDate).year() === year && moment(watchingDate).week() === week;
          });

          break;
        case `statistic-month`:
          filtered = this._films.filter(({user: {watchingDate}}) => {
            return moment(watchingDate).year() === year && moment(watchingDate).month() === month;
          });

          break;
        case `statistic-year`:
          filtered = this._films.filter(({user: {watchingDate}}) => {
            return moment(watchingDate).year() === year;
          });

          break;
      }

      const newLabels = this._getChartLabels(filtered);
      const newData = this._getChartData(filtered, newLabels);

      this._updateChart(newLabels, newData);
      this._statInfo = new StatInfo(filtered);

      statInfoEl.replaceWith(this._statInfo.getElement());
    });

    chartEl.before(this._statInfo.getElement());
  }
}

export {StatController};
