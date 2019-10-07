import {MIN_PER_HOUR} from '../const';
import AbstractComponent from './abstract-component';

class StatInfo extends AbstractComponent {
  constructor(films, topGenre) {
    super();
    this._films = films;
    this._totalDuration = this._films.reduce((duration, film) => {
      return duration + film.duration;
    }, 0);
    this._topGenre = topGenre;
  }

  getTemplate() {
    return `
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._films.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${(this._totalDuration / MIN_PER_HOUR).toFixed()} <span class="statistic__item-description">h</span> ${this._totalDuration % MIN_PER_HOUR} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._topGenre}</p>
        </li>
      </ul>
    `;
  }
}

export default StatInfo;
