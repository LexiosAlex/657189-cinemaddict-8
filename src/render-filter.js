import {FILTERS_AREA} from './export-const.js';

export default (data) => {
  data.forEach((item) => {
    const {id, caption, amount, active} = item;
    const elementTemplate = document.createElement(`template`);

    const createFilter = `
      <a href="#${id.toLowerCase()}" id="${id.toLowerCase()}" class="main-navigation__item ${active ? `main-navigation__item--active` : ` `} ">
        ${caption}
        ${amount ? `<span class="main-navigation__item-count">${amount}</span>` : ` `}
      </a>
      `;
    elementTemplate.innerHTML = createFilter;
    FILTERS_AREA.appendChild(elementTemplate.content);
  });
};

