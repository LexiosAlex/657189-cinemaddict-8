import Filter from './Filter.js';

export default class FilterAll extends Filter {
  constructor(data) {
    super();

    this._dataArray = data;
    this._active = false;
    this._element = null;
    this._renderAllFilms = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  set renderAllFilms(fn) {
    this._renderAllFilms = fn;
  }

  _onFilterButtonClick(evt) {
    evt.preventDefault();
    this._active = !this._active;

    const newData = this._dataArray;
    if (typeof this._renderAllFilms === `function`) {
      this._renderAllFilms(newData);
    }
  }

  get template() {
    return `
    <a href="#all" class="main-navigation__item ${this._active ? `main-navigation__item--active` : ` `} ">
      All movies
    </a>`.trim();
  }

  deactive() {
    this._active = false;
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterButtonClick);
  }

}
