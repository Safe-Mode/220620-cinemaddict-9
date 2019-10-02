import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {render, unrender} from '../util';
import {Stat} from '../components/stat';

class StatController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._stat = new Stat();
    this._chart = null;
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

    const labels = this._films.reduce((genres, film) => {
      film.genres.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      });

      return genres;
    }, []);

    const data = this._films.reduce((counts, film) => {
      labels.forEach((label, i) => {
        if (film.genres.has(label)) {
          counts[i]++;
        }
      });

      return counts;
    }, new Array(labels.length).fill(0));

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
  }
}

export {StatController};
