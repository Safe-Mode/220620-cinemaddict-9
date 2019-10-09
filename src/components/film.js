import {MIN_PER_HOUR, RADIX_TEN} from '../const';
import AbstractComponent from './abstract-component';

class Film extends AbstractComponent {
  constructor({id, title, rate, release, duration, genres, poster, description, comments, user: {watchlist, watched, favorite}}) {
    super();
    this._id = id;
    this._title = title;
    this._rate = rate;
    this._release = release;
    this._duration = duration;
    this._genres = Array.from(genres);
    this._poster = poster;
    this._description = description;
    this._comments = comments;
    this._watchlist = watchlist;
    this._watched = watched;
    this._favorite = favorite;
  }

  getTemplate() {
    return `
      <article class="film-card" data-id="${this._id}">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rate}</p>
        <p class="film-card__info">
          <span class="film-card__year">${new Date(this._release).getFullYear()}</span>
          <span class="film-card__duration">${parseInt(this._duration / MIN_PER_HOUR, RADIX_TEN)}h ${this._duration % MIN_PER_HOUR}m</span>
          <span class="film-card__genre">${this._genres[0]}</span>
        </p>
        <img src="${this._poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${(this._description.length > 140) ? `${this._description.slice(0, 140)}...` : this._description}</p>
        <a class="film-card__comments">${this._comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${(this._watchlist) ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${(this._watched) ? `film-card__controls-item--active` : ``}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${(this._favorite) ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
      </article>
    `;
  }
}

export default Film;
