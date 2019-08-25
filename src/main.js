import {Film} from './components/film-card';
import {FilmDetails} from './components/film-details';
import {Films} from './components/films';
import {Menu} from './components/menu';
import {ExtraFilms} from './components/extra-films';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {ShowMore} from './components/show-more';
import {Sorting} from './components/sorting';
import {films, amount, rankMap} from './data';
import {FILM_CARDS_PER_ROW} from './const';

const render = (container, element, position = `end`) => {
  const insert = {
    end: `append`,
    begin: `prepend`,
  };

  container[insert[position]](element);
};

const renderFilmCardsRow = () => {
  for (let i = 0; i < FILM_CARDS_PER_ROW && films.length; i++) {
    render(filmsListContainerEl, new Film(films[0]).getElement());
    films.shift();
  }
};

const bodyEl = document.querySelector(`body`);
const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);

render(headerEl, new Search().getElement());
render(headerEl, new Profile(amount, rankMap).getElement());
render(mainEl, new Menu(films).getElement());
render(mainEl, new Sorting().getElement());
render(mainEl, new Films().getElement());

const filmsEl = document.querySelector(`.films`);
const filmsListEl = document.querySelector(`.films-list`);
const filmsListContainerEl = filmsListEl.querySelector(`.films-list__container`);

render(filmsListEl, new ShowMore().getElement());
render(filmsEl, new ExtraFilms(`Top rated`).getElement());
render(filmsEl, new ExtraFilms(`Most commented`).getElement());
renderFilmCardsRow();

const extraFilmsEls = document.querySelectorAll(`.films-list--extra`);

extraFilmsEls.forEach((extraFilmsEl) => {
  const extraFilmsContainerEl = extraFilmsEl.querySelector(`.films-list__container`);

  for (let i = 0; i < 2; i++) {
    render(extraFilmsContainerEl, new Film(films[i]).getElement());
  }
});

const showMoreEl = document.querySelector(`.films-list__show-more`);

showMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  renderFilmCardsRow();

  if (!films.length) {
    evt.currentTarget.remove();
  }
});

render(bodyEl, new FilmDetails(films[0]).getElement());
// bodyEl.classList.add(`hide-overflow`);
