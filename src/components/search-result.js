import AbstractComponent from './abstract-component';

class SearchResult extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return `
      <div class="result">
        <p class="result__text">Result <span class="result__count">${this._count}</span></p>
      </div>
    `;
  }
}

export default SearchResult;
