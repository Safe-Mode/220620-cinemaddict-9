import {getRank, createElement} from '../util';

// const getProfileTpl = (amount, rankMap) => {
//   const rank = getRank(amount, rankMap);

//   return `
//     <section class="header__profile profile">
//       <p class="profile__rating">${rank}</p>
//       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
//     </section>
//   `;
// };

class Profile {
  constructor(amount, rankMap) {
    this._element = null;
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

export {Profile};
