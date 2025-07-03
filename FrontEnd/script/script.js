function mainGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      // vider la galerie
      gallery.innerHTML = "";
      // création des projets depuis API
      data.forEach((work) => {
        const projet = document.createElement("figure");
        projet.dataset.id = work.id;
        gallery.appendChild(projet);
        const imgWork = document.createElement("img");
        imgWork.src = work.imageUrl;
        projet.appendChild(imgWork);
        const titleWork = document.createElement("figcaption");
        titleWork.innerText = work.title;
        projet.setAttribute("data-category", work.category.name);
        projet.appendChild(titleWork);
      });
      // récupérer les filtres éxistants
      const filtersName = new Set();
      data.forEach((filter) => {
        filtersName.add(filter.category.name);
      });
      // Création des filtres

      const filters = document.querySelector(".filterBox");
      filters.innerHTML = "";
      // button "tous"
      const allBtn = document.createElement("button");
      allBtn.innerText = "Tous";
      allBtn.classList.add("active");
      filters.appendChild(allBtn);

      filtersName.forEach((button) => {
        const filterBtn = document.createElement("button");
        filterBtn.innerText = button;
        filters.appendChild(filterBtn);
      });

      // Function de filtrage
      const projets = document.querySelectorAll(".gallery figure");
      const filterButtons = document.querySelectorAll(".filterBox button");
      filterButtons.forEach((buttonClick) => {
        buttonClick.addEventListener("click", (e) => {
          // 1. Enlève la classe active à tous les boutons
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          // 2. Ajoute la classe active au bouton cliqué
          e.target.classList.add("active");
          //
          const filtre = e.target.textContent;
          projets.forEach((projet) => {
            if (filtre === "Tous" || projet.dataset.category === filtre) {
              projet.style.display = "";
            } else {
              projet.style.display = "none";
            }
          });
          console.log(filtre);
        });
      });
    });
}

// mode édition
function edition() {
  const edition = document.querySelectorAll(".edition");
  if (localStorage.getItem("token")) {
    // Affiche les boutons .edition
    edition.forEach((editButton) => {
      editButton.style.display = "block";
    });
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
  } else {
    // Cache les boutons si pas connecté
    edition.forEach((editButton) => {
      editButton.style.display = "none";
    });
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
  }

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}

// modale modification
function modal() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const galleryModal = document.querySelector(".galleryModal");
      // vider la galerie
      galleryModal.innerHTML = "";
      // creation des projets depuis API
      data.forEach((work) => {
        const projet = document.createElement("figure");
        projet.dataset.id = work.id;
        galleryModal.appendChild(projet);

        const imgWork = document.createElement("img");
        imgWork.src = work.imageUrl;
        projet.appendChild(imgWork);

        const trash = document.createElement("button");
        trash.dataset.id = work.id;
        trash.classList.add("deleteProject");

        const i = document.createElement("i");
        i.classList.add("fa-regular", "fa-trash-can");
        trash.appendChild(i);
        projet.appendChild(trash);
      });
    });
}

//   delete project
const galleryModal = document.querySelector(".galleryModal");
galleryModal.addEventListener("click", function (e) {
  const btn = e.target.closest(".deleteProject");
  if (btn) {
    const id = btn.dataset.id;
    const token = localStorage.getItem("token");
    // suppression du projet dans la base de données
    fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok === true) {
        mainGallery();
        modal(); // rechargement de la modale
      }
    });
  }
});

// open modal
const openModal = document.querySelector(".modifier");
openModal.addEventListener("click", () => {
  modal();
  document.getElementById("modalEdition").style.display = "block";
});

// close modal
const closeModal = document.querySelectorAll(".closeModal");
closeModal.forEach((close) => {
  close.addEventListener("click", () => {
    document.getElementById("modalEdition").style.display = "none";
  });
});

mainGallery();
edition();
