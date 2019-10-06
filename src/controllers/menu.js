import {render, unrender} from '../util';
import {Menu} from '../components/menu';

class MenuController {
  constructor(container) {
    this._container = container;
    this._menu = new Menu();
    this._toggleContent = null;
    this._changeActiveLinkState = this._changeActiveLinkState.bind(this);
  }

  _changeActiveLinkState(target) {
    const activeLinkCls = `main-navigation__item--active`;
    const activeLinkEl = this._menu
      .getElement()
      .querySelector(`.${activeLinkCls}`);
    const isNewLink = activeLinkEl !== target;

    if (isNewLink) {
      activeLinkEl.classList.remove(activeLinkCls);
      target.classList.add(activeLinkCls);
    }
  }

  show() {
    render(this._container, this._menu.getElement());
  }

  hide() {
    unrender(this._menu.getElement());
  }

  update(films, toggleContent) {
    const oldElement = this._menu.getElement();

    this._menu = new Menu(films);
    this._toggleContent = toggleContent;

    const menuEl = this._menu.getElement();

    menuEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._toggleContent(evt.target, this._changeActiveLinkState);
    });

    oldElement.replaceWith(this._menu.getElement());
  }

  init() {
    render(this._container, this._menu.getElement());
  }
}

export {MenuController};
