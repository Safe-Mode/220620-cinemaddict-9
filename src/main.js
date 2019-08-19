import {getFilmCardTpl} from './components/film-card';
import {getFilmDetailsTpl} from './components/film-details';
import {getFilmsTpl} from './components/films';
import {getMenuTpl} from './components/menu';
import {getMostCommentedFilmsTpl} from './components/most-commented-films';
import {getProfileTpl} from './components/profile';
import {getSearchTpl} from './components/search';
import {getShowMoreTpl} from './components/show-more';
import {getSortingTpl} from './components/sorting';
import {getTopFilmsTpl} from './components/top-films';
import {films} from './data';

const renderElement = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const bodyEl = document.querySelector(`body`);
const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);

renderElement(headerEl, getSearchTpl());
renderElement(headerEl, getProfileTpl());
renderElement(mainEl, getMenuTpl());
renderElement(mainEl, getSortingTpl());
renderElement(mainEl, getFilmsTpl());

const filmsEl = document.querySelector(`.films`);
const filmsListEl = document.querySelector(`.films-list`);
const filmsListContainerEl = filmsListEl.querySelector(`.films-list__container`);

renderElement(filmsListEl, getShowMoreTpl());
renderElement(filmsEl, getTopFilmsTpl());
renderElement(filmsEl, getMostCommentedFilmsTpl());

films.forEach((film) => {
  renderElement(filmsListContainerEl, getFilmCardTpl(film));
});

const extraFilmsEls = document.querySelectorAll(`.films-list--extra`);

extraFilmsEls.forEach((extraFilmsEl) => {
  const extraFilmsContainerEl = extraFilmsEl.querySelector(`.films-list__container`);

  for (let i = 0; i < 2; i++) {
    renderElement(extraFilmsContainerEl, getFilmCardTpl(films[0]));
  }
});

// renderElement(bodyEl, getFilmDetailsTpl());
// bodyEl.classList.add(`hide-overflow`);
