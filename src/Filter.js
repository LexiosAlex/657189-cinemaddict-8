import createElement from './create-element.js';

export default class Filter {
  constructor() {
    if (new.target === Filter) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {
    };
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {}

  unbind() {}

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  _particularUpdate() {
    this._element.innerHTML = createElement(this.template).innerHTML;
  }
}
