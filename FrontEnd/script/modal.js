fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    // création des projets depuis API
    const galleryModal = document.querySelector(".galleryModal");
    data.forEach((work) => {
      const projet = document.createElement("figure");
      galleryModal.appendChild(projet);
      const imgWork = document.createElement("img");
      imgWork.src = work.imageUrl;
      projet.appendChild(imgWork);
      const trash = document.createElement("button");
      trash.classList.add("deleteProject");
      const i = document.createElement("i");
      i.classList.add("fa-regular", "fa-trash-can");
      trash.appendChild(i);
      projet.appendChild(trash);
    });
  });

// open modal
const openModal = document.querySelector(".modifier");
openModal.addEventListener("click", () => {
  const modalEdition = document.getElementById("modalEdition");
  modalEdition.style.display = "block";
});

// close modal
const closeModal = document.querySelectorAll(".closeModal");
closeModal.forEach((close) => {
  close.addEventListener("click", () => {
    const modalEdition = document.getElementById("modalEdition");
    modalEdition.style.display = "none";
  });
});

//   delete project
//   const deleteProject = document.querySelectorAll(".deleteProject");
//   deleteProject.forEach((deleteBtn) => {
//     deleteBtn.addEventListener("click", (e) => {
//       const id = e.target.parentElement.dataset.id;
//       fetch("http://localhost:5678/api/works/" + id, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
