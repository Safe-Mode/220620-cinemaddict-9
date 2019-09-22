import {render} from './util';
import {PageController} from './controllers/page';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {Stat} from './components/stat';
import {films, amount, rankMap} from './data';

const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);
const page = new PageController(mainEl, films);
const menu = new Menu(films);
const stats = new Stat();

menu
  .getElement()
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.hash) {
      case `#all`:
        stats.getElement().classList.add(`visually-hidden`);
        page.show();
        break;
      case `#stats`:
        page.hide();
        stats.getElement().classList.remove(`visually-hidden`);
        break;
    }
  });

render(headerEl, new Search().getElement());
render(headerEl, new Profile(amount, rankMap).getElement());
render(mainEl, menu.getElement());
render(mainEl, stats.getElement());
stats.getElement().classList.add(`visually-hidden`);
page.init();
