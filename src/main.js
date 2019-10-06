import {SEARCH_MIN_LENGTH, END_POINT, AUTH} from './const';
import {render, unrender, getRank, rankMap} from './util';
import {PageController} from './controllers/page';
import {Menu} from './components/menu';
import {Profile} from './components/profile';
import {Search} from './components/search';
import {SearchController} from './controllers/search';
import {StatController} from './controllers/stat';
import {Footer} from './components/footer';
import {API} from './api';
import {ModelComment} from './model-comment';

const api = new API({
  endPoint: END_POINT,
  authorization: AUTH,
});

const changeCommentsState = (wrapper, isDisabled) => {
  wrapper.querySelector(`.film-details__comment-input`).disabled = isDisabled;

  wrapper
    .querySelectorAll(`.film-details__emoji-item`)
    .forEach((item) => {
      item.disabled = isDisabled;
    });
};

const changeRatingState = (wrapper, isDisabled) => {
  wrapper
    .querySelectorAll(`.film-details__user-rating-input`)
    .forEach((input) => {
      input.disabled = isDisabled;
    });
};

const toggleError = (element, isError) => {
  const clsMethod = (isError) ? `add` : `remove`;

  element.classList[clsMethod](`error`);
  element.classList[clsMethod](`shake`);
};

const onDataChange = (action, film, cb, deleted) => {
  switch (action) {
    case `post`:
      const commentsWrapEl = document.querySelector(`.film-details__new-comment`);

      toggleError(commentsWrapEl, false);
      changeCommentsState(commentsWrapEl, true);

      api.postComment({
        filmId: film.id,
        comment: ModelComment.toRAW([...film.comments].pop()),
      })
        .then((comments) => {
          film.comments = comments;
          cb(film);
        })
        .catch(() => {
          toggleError(commentsWrapEl, true);
          changeCommentsState(commentsWrapEl, false);
        });
      break;
    case `update`:
      const ratingWrapEl = document.querySelector(`.film-details__user-rating-wrap`);

      if (ratingWrapEl) {
        toggleError(ratingWrapEl, false);
        changeRatingState(ratingWrapEl, true);
      }

      api.updateMovie({
        id: film.id,
        data: film.toRAW(),
      })
        .then(cb)
        .catch(() => {
          toggleError(ratingWrapEl, true);
          changeRatingState(ratingWrapEl, false);
        });
      break;
    case `delete`:
      api.deleteComment({id: deleted})
        .then(() => {
          cb(film);
        });
      break;
  }
};

api.getMovies().then((films) => {
  const watched = films.filter(({user}) => user.watched);
  const rank = getRank(watched.length, rankMap);
  const headerEl = document.querySelector(`.header`);
  const mainEl = document.querySelector(`.main`);
  const page = new PageController(mainEl, films, onDataChange);
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

    const activeLinkCls = `main-navigation__item--active`;
    const activeLinkEl = menuEl.querySelector(`.${activeLinkCls}`);
    const isNewLink = activeLinkEl !== evt.target;

    const updateFilms = (newFilms) => {
      stats.hide();
      page.show(newFilms);
    };

    api.getMovies().then((newFilms) => {
      let filtered = [];

      switch (evt.target.hash) {
        case `#all`:
          updateFilms(newFilms);
          break;
        case `#watchlist`:
          filtered = newFilms.filter(({user}) => user.watchlist);
          updateFilms(filtered);
          break;
        case `#history`:
          filtered = newFilms.filter(({user}) => user.watched);
          updateFilms(filtered);
          break;
        case `#favorites`:
          filtered = newFilms.filter(({user}) => user.favorite);
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
  render(document.body, new Footer(films.length).getElement());
});
