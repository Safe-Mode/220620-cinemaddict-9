import {getRank} from '../util';
import {AbstractComponent} from './abstract-component';

class Profile extends AbstractComponent {
  constructor(amount, rankMap) {
    super();
    this._rank = getRank(amount, rankMap);
  }

  getTemplate() {
    return `
      <section class="header__profile profile">
        <p class="profile__rating">${this._rank}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>
    `;
  }
}

export {Profile};
