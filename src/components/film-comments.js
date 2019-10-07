import {EMOJIS} from '../const';
import AbstractComponent from './abstract-component';

class FilmComments extends AbstractComponent {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return `
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${this._comments.map(({emoji, text, name, published}) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${name}</span>
                <span class="film-details__comment-day">${new Intl.DateTimeFormat(`en-GB`, {year: `2-digit`, month: `2-digit`, day: `2-digit`, hour: `2-digit`, minute: `2-digit`}).format(published)}</span>
                <button class="film-details__comment-delete" type="button">Delete</button>
              </p>
            </div>
          </li>`).join(``)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${EMOJIS.map((emoji) => `
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
              <label class="film-details__emoji-label" for="emoji-${emoji}">
                <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
              </label>
            `).join(``)}
          </div>
        </div>
      </section>
    `;
  }
}

export default FilmComments;
