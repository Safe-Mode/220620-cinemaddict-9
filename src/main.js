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
import {render, unrender, isEscPressed} from './util';

const openPopup = (popup) => {
  render(bodyEl, popup.getElement());
  bodyEl.classList.add(`hide-overflow`);
};

const closePopup = (popup) => {
  unrender(popup.getElement());
  popup.removeElement();
  bodyEl.classList.remove(`hide-overflow`);
};

const renderFilmCardsRow = () => {
  for (let i = 0; i < FILM_CARDS_PER_ROW && films.length; i++) {
    const filmCard = new Film(films[0]);
    const filmDetails = new FilmDetails(films[0]);
    const filmCardEl = filmCard.getElement();

    const onEscKeydown = (evt) => {
      if (isEscPressed(evt.key)) {
        closePopup(filmDetails);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCloseBtnClick = (closeEvt) => {
      closeEvt.preventDefault();

      if (closeEvt.target.classList.contains(`film-details__close-btn`)) {
        closePopup(filmDetails);
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    const onCardTogglerClick = (evt) => {
      evt.preventDefault();

      const togglers = [`film-card__poster`, `film-card__title`, `film-card__comments`];

      if (togglers.some((cls) => evt.target.classList.contains(cls))) {
        openPopup(filmDetails);
        document.addEventListener(`keydown`, onEscKeydown);

        filmDetails
          .getElement()
          .addEventListener(`click`, onCloseBtnClick);
      }
    };

    filmCardEl.addEventListener(`click`, onCardTogglerClick);
    render(filmsListContainerEl, filmCardEl);
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
const showMore = new ShowMore();
const showMoreEl = showMore.getElement();

render(filmsListEl, showMoreEl);
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

showMoreEl.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  renderFilmCardsRow();

  if (!films.length) {
    unrender(evt.currentTarget);
    showMore.removeElement();
  }
});
