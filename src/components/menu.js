import {Nav} from '../const';
import {getStats} from '../util';
import AbstractComponent from './abstract-component';

class Menu extends AbstractComponent {
  constructor(films, activeLink) {
    super();
    this._stats = (films) ? getStats(films) : null;
    this._activeLink = (activeLink) ? activeLink : null;
  }

  _checkActiveState(anchor) {
    return this._activeLink && this._activeLink.href.includes(anchor);
  }

  getTemplate() {
    return `
      <nav class="main-navigation">
        <a href="#${Nav.Anchor.ALL}" class="main-navigation__item ${(!this._activeLink) ? Nav.ACTIVE_CLS : ``}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${(this._checkActiveState(Nav.Anchor.WATCHLIST)) ? Nav.ACTIVE_CLS : ``}">Watchlist <span class="main-navigation__item-count">${(this._stats) ? this._stats.watchlist : 0}</span></a>
        <a href="#history" class="main-navigation__item ${(this._checkActiveState(Nav.Anchor.HISTORY)) ? Nav.ACTIVE_CLS : ``}">History <span class="main-navigation__item-count">${(this._stats) ? this._stats.watched : 0}</span></a>
        <a href="#favorites" class="main-navigation__item ${(this._checkActiveState(Nav.Anchor.FAVORITES)) ? Nav.ACTIVE_CLS : ``}">Favorites <span class="main-navigation__item-count">${(this._stats) ? this._stats.favorite : 0}</span></a>
        <a href="#stats" class="main-navigation__item main-navigation__item--additional ${(this._checkActiveState(Nav.Anchor.STATS)) ? Nav.ACTIVE_CLS : ``}">Stats</a>
      </nav>
    `;
  }
}

export default Menu;
