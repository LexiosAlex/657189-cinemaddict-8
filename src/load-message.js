import {FILMS_LIST_MAIN} from './export-const.js';

const template = `<div>Loading movies...</div>`;
const messageTemplate = document.createElement(`div`);
messageTemplate.innerHTML = template;
messageTemplate.style.cssText = `
  display: flex;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 300px;
  margin-bottom: 300px;
  height: 150px;
  border: solid 2px var(--outline-color);
  align-items: center;
  justify-content: center;
  text-align: center;
`;
FILMS_LIST_MAIN.appendChild(messageTemplate);

export const hideLoadMassage = () => {
  messageTemplate.classList.add(`visually-hidden`);
};

export const erorMassage = () => {
  messageTemplate.firstChild.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  messageTemplate.style.border = `2px solid red`;
};
