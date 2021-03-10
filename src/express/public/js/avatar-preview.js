const uploadInput = document.querySelector(`.js-input-avatar`);
const uploadPreview = document.querySelector(`.js-preview-avatar`);

uploadInput.addEventListener(`change`, (event) => {
  const files = event.target.files;
  if (files.length === 0)
    return;

  const reader = new FileReader();

  reader.readAsDataURL(files[0]);

  reader.onload = () => {
    uploadPreview.src = reader.result;
  };
});
