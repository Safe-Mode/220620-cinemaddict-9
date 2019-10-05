// import moment from 'moment';
import {MIN_PER_HOUR, RADIX_TEN} from '../const';
import {AbstractComponent} from './abstract-component';

class FilmDetails extends AbstractComponent {
  constructor({poster, age, title, rate, director, writers, actors, release, duration, country, genres, description, user: {watchlist, watched, favorite, rating}}) {
    super();
    this._poster = poster;
    this._age = age;
    this._title = title;
    this._rate = rate;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._release = release;
    this._duration = duration;
    this._country = country;
    this._genres = genres;
    this._description = description;
    this._watchlist = watchlist;
    this._watched = watched;
    this._favorite = favorite;
    this._rating = +rating;
  }

  getTemplate() {
    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${this._poster}" alt="">

                <p class="film-details__age">${this._age}+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${this._title}</h3>
                    <p class="film-details__title-original">Original: ${this._title}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${this._rate}</p>
                    ${(this._rating) ? `
                      <p class="film-details__user-rating">Your rate ${this._rating}</p>
                    ` : ``}
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${this._director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${this._writers.join(`, `)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${this._actors.join(`, `)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${new Intl.DateTimeFormat(`en-GB`, {day: `2-digit`, month: `long`, year: `numeric`}).format(this._release)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${parseInt(this._duration / MIN_PER_HOUR, RADIX_TEN)}h ${this._duration % MIN_PER_HOUR}m</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${this._country}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Genres</td>
                    <td class="film-details__cell">
                      ${Array.from(this._genres).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(` `)}
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${this._description}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${(this._watchlist) ? `checked` : ``}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${(this._watched) ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${(this._favorite) ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          ${(this._watched) ? `
          <div class="form-details__middle-container">
            <section class="film-details__user-rating-wrap">
              <div class="film-details__user-rating-controls">
                <button class="film-details__watched-reset" type="button">Undo</button>
              </div>

              <div class="film-details__user-score">
                <div class="film-details__user-rating-poster">
                  <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
                </div>

                <section class="film-details__user-rating-inner">
                  <h3 class="film-details__user-rating-title">${this._title}</h3>

                  <p class="film-details__user-rating-feelings">How you feel it?</p>

                  <div class="film-details__user-rating-score">

                    ${new Array(9).fill(``).map((it, i) => `
                      <input
                        type="radio"
                        name="score"
                        class="film-details__user-rating-input visually-hidden"
                        value="${i + 1}" id="rating-${i + 1}"
                        ${(this._rating === i + 1) ? `checked` : ``}
                      >
                      <label
                        class="film-details__user-rating-label"
                        for="rating-${i + 1}"
                      >${i + 1}</label>
                    `).join(``)}

                  </div>
                </section>
              </div>
            </section>
          </div>
          ` : ``}

          <div class="form-details__bottom-container"></div>
        </form>
      </section>
    `;
  }

  getRatingTemplate() {
    return `

    `;
  }
}

export {FilmDetails};
