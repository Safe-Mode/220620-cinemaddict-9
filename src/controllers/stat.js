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
    const chartCtx = statEl.querySelector(`.statistic__chart`);

    this.show();

    this._chart = new Chart(chartCtx, {
      type: `horizontalBar`,
    });
  }
}

export {StatController};
