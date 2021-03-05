const onClick = (e) => {
  e.preventDefault();
  window.history.back();
}

const backButtons = Array.from(document.querySelectorAll(`.js-back-button`));

backButtons.forEach(button => {
  button.addEventListener(`click`, onClick);
})
