import {getStats} from '../util';

const getMenuTpl = (films) => {
  const stats = getStats(films);

  return `
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${stats.watchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${stats.watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${stats.favorites}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
  `;
};

export {getMenuTpl};
