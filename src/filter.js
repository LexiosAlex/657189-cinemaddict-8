import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._active = data.active;
    this._amount = data.amount;
    this._caption = data.caption;

    this._onFilterClick = null;
    this._element = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  set onFilterClick(fn) {
    this._onFilterClick = fn;
  }

  _onFilterButtonClick() {
    return typeof this._onFilterClick === `function` && this._onFilterClick();
  }

  get template() {
    return `<a href="#${this._id.toLowerCase()}" id="${this._id.toLowerCase()}" class="main-navigation__item ${this._active ? `main-navigation__item--active` : ` `} ">
      ${this._caption}
      ${this._amount ? `<span class="main-navigation__item-count">${this._amount}</span>` : ` `}
    </a>
    `.trim();
  }

  deActivate() {
    this._active = false;
  }

  activate() {
    this._active = true;
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterButtonClick);
  }

  reRender() {
    this.unbind();
    this._particularUpdate();
    this.bind();
  }
}
