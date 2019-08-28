import {AbstractComponent} from './abstract-component';

class Films extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <section class="films"></section>
    `;
  }
}

export {Films};
