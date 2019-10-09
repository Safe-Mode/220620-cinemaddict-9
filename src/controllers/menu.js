import {Nav} from '../const';
import {render, unrender} from '../util';
import Menu from '../components/menu';

class MenuController {
  constructor(container) {
    this._container = container;
    this._menu = new Menu();
    this._toggleContent = null;
    this._activeLink = null;
    this._changeActiveLinkState = this._changeActiveLinkState.bind(this);
  }

  _changeActiveLinkState(target) {
    const activeLinkEl = this._menu
      .getElement()
      .querySelector(`.${Nav.ACTIVE_CLS}`);
    const isNewLink = activeLinkEl !== target;

    if (isNewLink) {
      activeLinkEl.classList.remove(Nav.ACTIVE_CLS);
      target.classList.add(Nav.ACTIVE_CLS);
      this._activeLink = target;
    }
  }

  show() {
    render(this._container, this._menu.getElement());
  }

  hide() {
    unrender(this._menu.getElement());
  }

  update(toggleContent, films) {
    const oldElement = this._menu.getElement();

    this._menu = new Menu(films, this._activeLink);
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

export default MenuController;
