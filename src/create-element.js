export default (template) => {
  const elementTemplate = document.createElement(`div`);
  elementTemplate.innerHTML = template;
  return elementTemplate.firstChild;
};
