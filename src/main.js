import {render} from './util';
import {PageController} from './controllers/page';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {films, amount, rankMap} from './data';

const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);
const page = new PageController(mainEl, films);

render(headerEl, new Search().getElement());
render(headerEl, new Profile(amount, rankMap).getElement());
render(mainEl, new Menu(films).getElement());
page.init();
