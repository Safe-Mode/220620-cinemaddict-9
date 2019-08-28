import {AbstractComponent} from "./abstract-component";

class Films extends AbstractComponent {
  constructor(films) {
    super();
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
}

export {Films};
