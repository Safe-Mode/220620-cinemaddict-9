const MIN_PER_HOUR = 60;
const RADIX_TEN = 10;
const SEARCH_MIN_LENGTH = 3;
const CardsPerRow = {
  MAIN: 5,
  EXTRA: 2,
};
const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];
const Status = {
  OK: 200,
  MULTI: 300,
};
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict/`;
const AUTH = `Basic lalala`;
const StoreKey = {
  MOVIES: `movies-store`,
  COMMENTS: `comments-store`,
};
const MAX_FILM_RATE = 9;
const DEBOUNCE_TIME = 500;
const Nav = {
  ACTIVE_CLS: `main-navigation__item--active`,
  Anchor: {
    ALL: `all`,
    WATCHLIST: `watchlist`,
    HISTORY: `history`,
    FAVORITES: `favorites`,
    STATS: `stats`,
  },
};

export {MIN_PER_HOUR, RADIX_TEN, CardsPerRow, EMOJIS, SEARCH_MIN_LENGTH, Status, END_POINT, AUTH, StoreKey, MAX_FILM_RATE, DEBOUNCE_TIME, Nav};
