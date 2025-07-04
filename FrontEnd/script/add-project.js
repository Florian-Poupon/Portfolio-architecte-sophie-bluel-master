const ajoutPhoto = document.querySelector(".addProject");
ajoutPhoto.addEventListener("click", () => {
  const modal = document.querySelector("#ajoutPhoto");
  modal.style.display = "flex";

  const close = document.querySelector(".modal");
  close.style.display = "none";
  catModal();
});
