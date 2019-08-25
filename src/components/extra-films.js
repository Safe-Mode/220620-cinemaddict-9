import {createElement} from '../util';

// const getMostCommentedFilmsTpl = () => {
//   return `
//     <section class="films-list--extra">
//       <h2 class="films-list__title">Most commented</h2>
//       <div class="films-list__container"></div>
//     </section>
//   `;
// };

class ExtraFilms {
  constructor(title) {
    this._element = null;
    this._title = title;
  }

  getTemplate() {
    return `
      <section class="films-list--extra">
        <h2 class="films-list__title">${this._title}</h2>
        <div class="films-list__container"></div>
      </section>
    `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export {ExtraFilms};
