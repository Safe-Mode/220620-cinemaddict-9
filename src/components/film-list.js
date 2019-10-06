import {AbstractComponent} from './abstract-component';

class FilmList extends AbstractComponent {
  constructor(listTitle, films, isExtra = false) {
    super();
    this._title = listTitle;
    this._quantity = films.length;
    this._isExtra = isExtra;
  }

  getTemplate() {
    return `
      <section class="films-list${(this._isExtra) ? `--extra` : ``}">
        <h2 class="films-list__title ${(this._isExtra) ? `` : `visually-hidden`}">${this._title}</h2>
        ${(this._quantity) ? `<div class="films-list__container"></div>` : `<div class="no-result">
          There are no movies in our database.
        </div>`}
      </section>
    `;
  }
}

export {FilmList};
