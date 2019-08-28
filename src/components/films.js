import {FILM_CARDS_PER_ROW} from '../const';
import {render, unrender, isEscPressed} from '../util';
import {AbstractComponent} from './abstract-component';
import {Film} from './film';
import {FilmDetails} from './film-details';
import {ExtraFilms} from './extra-films';
import {ShowMore} from './show-more';

class Films extends AbstractComponent {
  constructor(films) {
    super();
    this._quantity = films.length;
  }

  getTemplate() {
    return `
      <section class="films">
        <section class="films-list">
          <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
          ${(this._quantity) ? `<div class="films-list__container"></div>` : `<div class="no-result">
            There is no movies for your request.
          </div>`}
        </section>
      </section>
    `;
  }
}

class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
  }

  _renderFilmCard(film, filmsListEl) {
    const bodyEl = document.querySelector(`body`);
    const filmsListContainerEl = filmsListEl.querySelector(`.films-list__container`);
    const filmCard = new Film(film);
    const filmDetails = new FilmDetails(film);
    const filmCardEl = filmCard.getElement();

    const openPopup = (popup) => {
      render(bodyEl, popup.getElement());
      bodyEl.classList.add(`hide-overflow`);
    };

    const closePopup = (popup) => {
      unrender(popup.getElement());
      popup.removeElement();
      bodyEl.classList.remove(`hide-overflow`);
    };

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

    const onCommentBlur = () => {
      document.addEventListener(`keydown`, onEscKeydown);
    };

    const onCommentFocus = (evt) => {
      document.removeEventListener(`keydown`, onEscKeydown);
      evt.target.addEventListener(`blur`, onCommentBlur);
    };

    const onCardTogglerClick = (evt) => {
      evt.preventDefault();

      const togglers = [`film-card__poster`, `film-card__title`, `film-card__comments`];
      const isToggler = togglers.some((cls) => evt.target.classList.contains(cls));

      if (isToggler) {
        const filmDetailsEl = filmDetails.getElement();

        openPopup(filmDetails);

        document.addEventListener(`keydown`, onEscKeydown);
        filmDetailsEl.addEventListener(`click`, onCloseBtnClick);

        filmDetailsEl
              .querySelector(`.film-details__comment-input`)
              .addEventListener(`focus`, onCommentFocus);
      }
    };

    filmCardEl.addEventListener(`click`, onCardTogglerClick);
    render(filmsListContainerEl, filmCardEl);
  }

  init() {
    const filmsEl = new Films(this._films).getElement();
    const filmsListEl = filmsEl.querySelector(`.films-list`);
    const showMore = new ShowMore();
    const showMoreEl = showMore.getElement();

    const renderFilmCardsRow = (row = 1) => {
      const startIndex = (row - 1) * FILM_CARDS_PER_ROW;
      const finishIndex = row * FILM_CARDS_PER_ROW - 1;

      for (let i = startIndex; i <= finishIndex && i < this._films.length; i++) {
        this._renderFilmCard(this._films[i], filmsListEl);
      }

      if (row * FILM_CARDS_PER_ROW >= this._films.length) {
        unrender(showMoreEl);
        showMore.removeElement();
      }

      return ++row;
    };

    render(this._container, filmsEl);

    if (this._films.length) {
      render(filmsListEl, showMoreEl);
    }

    render(filmsEl, new ExtraFilms(`Top rated`).getElement());
    render(filmsEl, new ExtraFilms(`Most commented`).getElement());

    let row = renderFilmCardsRow();

    showMoreEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      row = renderFilmCardsRow(row);
    });
  }
}

export {PageController};
