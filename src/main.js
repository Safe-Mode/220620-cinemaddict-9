import {render} from './util';
import {Film} from './components/film';
import {PageController} from './components/films';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {Sorting} from './components/sorting';
import {films, amount, rankMap} from './data';

const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);

render(headerEl, new Search().getElement());
render(headerEl, new Profile(amount, rankMap).getElement());
render(mainEl, new Menu(films).getElement());
render(mainEl, new Sorting().getElement());

const page = new PageController(mainEl, films);

page.init();

const extraFilmsEls = document.querySelectorAll(`.films-list--extra`);

extraFilmsEls.forEach((extraFilmsEl) => {
  const extraFilmsContainerEl = extraFilmsEl.querySelector(`.films-list__container`);

  for (let i = 0; i < 2 && films.length; i++) {
    render(extraFilmsContainerEl, new Film(films[i]).getElement());
  }
});
