import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {render, unrender} from '../util';
import {Stat} from '../components/stat';

class StatController {
  constructor(container) {
    this._container = container;
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

    this.show();

    this._chart = new Chart(chartEl, {
      type: `horizontalBar`,
      data: {
        labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
        datasets: [{
          data: [11, 8, 7, 4, 3],
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
