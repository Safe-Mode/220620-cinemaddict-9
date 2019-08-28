import {MIN_PER_HOUR, RADIX_TEN} from '../const';
import {AbstractComponent} from './abstract-component';

class Film extends AbstractComponent {
  constructor({title, rate, release, duration, genres, poster, description, comments}) {
    super();
    this._title = title;
    this._rate = rate;
    this._release = release;
    this._duration = duration;
    this._genres = genres;
    this._poster = poster;
    this._description = description;
    this._comments = comments;
  }

  getTemplate() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rate}</p>
        <p class="film-card__info">
          <span class="film-card__year">${new Date(this._release).getFullYear()}</span>
          <span class="film-card__duration">${parseInt(this._duration / MIN_PER_HOUR, RADIX_TEN)}h ${this._duration % MIN_PER_HOUR}m</span>
          <span class="film-card__genre">${this._genres[0]}</span>
        </p>
        <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <a class="film-card__comments">${this._comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
      </article>
    `;
  }
}

export {Film};
