export const disableInputs = (inputs, disable) => {
  inputs.forEach((it) =>{
    it.disabled = disable;
  });
};
