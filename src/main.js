import {SEARCH_MIN_LENGTH} from './const';
import {render, unrender} from './util';
import {PageController} from './controllers/page';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {SearchController} from './controllers/search';
import {StatController} from './controllers/stat';
import {films, amount, rankMap} from './data';

const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);
const page = new PageController(mainEl, films);
const menu = new Menu(films);
const menuEl = menu.getElement();
const stats = new StatController(mainEl);
const search = new Search();
const searchEl = search.getElement();
let searchController = null;

const clearMainEl = () => {
  mainEl.innerHTML = ``;
};

const hideSearchBoard = () => {
  if (searchController) {
    render(mainEl, menuEl);
    page.show();
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

    switch (evt.target.hash) {
      case `#all`:
        stats.hide();
        page.show();
        break;
      case `#stats`:
        page.hide();
        stats.show();
        break;
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
render(headerEl, new Profile(amount, rankMap).getElement());
render(mainEl, menuEl);
page.init();
