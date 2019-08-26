import {createElement} from '../util';

// const getFilmsTpl = () => {
//   return `
//     <section class="films">
//       <section class="films-list">
//         <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
//         <div class="films-list__container"></div>
//       </section>
//     </section>
//   `;
// };

class Films {
  constructor(films) {
    this._element = null;
    this._quantity = films.length;
  }

  getTemplate() {
    return `
      <section class="films">
        <section class="films-list">
          <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
          ${(this._quantity) ? `<div class="films-list__container"></div>` : `<div class="no-result">
            There is no movies for your request.
          </div>`}
        </section>
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

export {Films};
