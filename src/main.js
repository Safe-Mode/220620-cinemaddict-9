import {debounce} from 'lodash';
import {Length, END_POINT, AUTH, StoreKey, DEBOUNCE_TIME} from './const';
import {render, getRank, rankMap, changeCommentsState} from './util';
import PageController from './controllers/page';
import MenuController from './controllers/menu';
import Profile from './components/profile';
import Search from './components/search';
import SearchController from './controllers/search';
import StatController from './controllers/stat';
import Footer from './components/footer';
import API from './api';
import Provider from './provider';
import Store from './store';
import ModelComment from './models/comment';

const headerEl = document.querySelector(`.header`);
const mainEl = document.querySelector(`.main`);
const search = new Search();
const searchEl = search.getElement();
const menu = new MenuController(mainEl);
let toggleContent = null;
let movies = [];

const api = new API({
  endPoint: END_POINT,
  authorization: AUTH,
});

const movieStore = new Store({
  key: StoreKey.MOVIES,
  storage: window.localStorage,
});

const commentStore = new Store({
  key: StoreKey.COMMENTS,
  storage: window.localStorage,
});

const provider = new Provider({api, movieStore, commentStore});

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
          cb(film, action);
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

      provider.updateMovie({
        id: film.id,
        data: film.toRAW(),
      })
        .then((movie) => {
          provider.getMovies().then((films) => {
            movies = films.map((it) => (it.id === movie.id) ? movie : it);
            menu.update(toggleContent, movies);
            cb(movie);
          });
        })
        .catch(() => {
          toggleError(ratingWrapEl, true);
          changeRatingState(ratingWrapEl, false);
        });
      break;
    case `delete`:
      api.deleteComment({id: deleted})
        .then(() => {
          cb(film, action);
        });
      break;
  }
};

const page = new PageController(mainEl, onDataChange);

render(headerEl, searchEl);
menu.init();
page.init();

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncMovies();
});

provider.getMovies().then((films) => {
  const watched = films.filter(({user}) => user.watched);
  const rank = getRank(watched.length, rankMap);
  const stats = new StatController(mainEl, watched, rank);
  let searchController = null;

  const clearMainEl = () => {
    mainEl.innerHTML = ``;
  };

  const checkSearch = (value) => {
    return value.length >= Length.SEARCH_MIN;
  };

  const hideSearchBoard = () => {
    if (searchController) {
      menu.show();
      page.show(films);
      searchController.hide();
    }
  };

  toggleContent = (target, changeLinkState) => {
    if (target.tagName !== `A`) {
      return;
    }

    const updateFilms = (newFilms) => {
      stats.hide();
      page.show(newFilms);
    };

    let filtered = [];

    switch (target.hash) {
      case `#all`:
        updateFilms(movies);
        break;
      case `#watchlist`:
        filtered = movies.filter(({user}) => user.watchlist);
        updateFilms(filtered);
        break;
      case `#history`:
        filtered = movies.filter(({user}) => user.watched);
        updateFilms(filtered);
        break;
      case `#favorites`:
        filtered = movies.filter(({user}) => user.favorite);
        updateFilms(filtered);
        break;
      case `#stats`:
        page.hide();
        stats.show();
        break;
    }

    changeLinkState(target);
  };

  searchEl
    .querySelector(`.search__field`)
    .addEventListener(`input`, debounce(({target: {value}}) => {
      const searchFilms = films.filter((film) => film.title.toLowerCase().includes(value.toLowerCase()));

      if (checkSearch(value)) {
        if (searchController) {
          clearMainEl();
        } else {
          menu.hide();
          page.hide();
          stats.hide();
        }

        searchController = new SearchController(mainEl, searchFilms, search);
        searchController.init();
        searchController.show();
      } else {
        hideSearchBoard();
      }
    }, DEBOUNCE_TIME));

  searchEl.addEventListener(`reset`, ({target}) => {
    if (checkSearch(new FormData(target).get(`search`))) {
      hideSearchBoard();
    }
  });

  movies = films;
  render(headerEl, new Profile(rank).getElement());
  menu.update(toggleContent, films);
  stats.init();
  page.update(films);
  render(document.body, new Footer(films.length).getElement());
});
