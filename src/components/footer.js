import {AbstractComponent} from './abstract-component';

class Footer extends AbstractComponent {
  constructor(quantity) {
    super();
    this._quantity = quantity;
  }

  getTemplate() {
    return `
    <footer class="footer">
      <section class="footer__logo logo logo--smaller">Cinemaddict</section>
      <section class="footer__statistics">
        <p>${this._quantity} movies inside</p>
      </section>
    </footer>
    `;
  }
}

export {Footer};
