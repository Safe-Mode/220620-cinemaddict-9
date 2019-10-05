import {SEARCH_MIN_LENGTH, END_POINT, AUTH} from './const';
import {render, unrender, getRank} from './util';
import {PageController} from './controllers/page';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {SearchController} from './controllers/search';
import {StatController} from './controllers/stat';
import {API} from './api';
import {rankMap} from './data';

const api = new API({
  endPoint: END_POINT,
  authorization: AUTH,
});

api.getMovies().then((films) => {
  const watched = films.filter(({user}) => user.watched);
  const rank = getRank(watched.length, rankMap);
  const headerEl = document.querySelector(`.header`);
  const mainEl = document.querySelector(`.main`);
  const page = new PageController(mainEl, films);
  const menu = new Menu(films);
  const menuEl = menu.getElement();
  const stats = new StatController(mainEl, watched, rank);
  const search = new Search();
  const searchEl = search.getElement();
  let searchController = null;

  const clearMainEl = () => {
    mainEl.innerHTML = ``;
  };

  const hideSearchBoard = () => {
    if (searchController) {
      render(mainEl, menuEl);
      page.show(films);
      searchController.hide();
    }
  };

  menu
  .getElement()
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    let filtered = [];
    const activeLinkCls = `main-navigation__item--active`;
    const activeLinkEl = menuEl.querySelector(`.${activeLinkCls}`);
    const isNewLink = activeLinkEl !== evt.target;

    const updateFilms = (newFilms) => {
      stats.hide();
      page.show(newFilms);
    };

    switch (evt.target.hash) {
      case `#all`:
        updateFilms(films);
        break;
      case `#watchlist`:
        filtered = films.filter(({user}) => user.watchlist);
        updateFilms(filtered);
        break;
      case `#history`:
        filtered = films.filter(({user}) => user.watched);
        updateFilms(filtered);
        break;
      case `#favorites`:
        filtered = films.filter(({user}) => user.favorite);
        updateFilms(filtered);
        break;
      case `#stats`:
        page.hide();
        stats.show();
        break;
    }

    if (isNewLink) {
      activeLinkEl.classList.remove(activeLinkCls);
      evt.target.classList.add(activeLinkCls);
    }
  });

  searchEl
  .querySelector(`.search__field`)
  .addEventListener(`input`, (evt) => {
    const value = evt.target.value.toLowerCase();
    const searchFilms = films.filter((film) => film.title.toLowerCase().includes(value));

    if (value.length >= SEARCH_MIN_LENGTH) {
      if (searchController) {
        clearMainEl();
      } else {
        unrender(menuEl);
        page.hide();
      }

      searchController = new SearchController(mainEl, searchFilms, search);
      searchController.init();
      searchController.show();
    } else {
      hideSearchBoard();
    }
  });

  searchEl.addEventListener(`reset`, hideSearchBoard);

  render(headerEl, searchEl);
  render(headerEl, new Profile(rank).getElement());
  render(mainEl, menuEl);
  stats.init();
  page.init();
});
