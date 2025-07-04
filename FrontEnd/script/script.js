// récupération des projets dans la page
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

// modale ouverture/fermeture
function modalDisplay() {
  // open modal
  const openModal = document.querySelector(".modifier");
  openModal.addEventListener("click", () => {
    modal();
    document.getElementById("modalEdition").style.display = "block";
    document.querySelector(".modal").style.display = "flex";
  });
  // close modal
  const closeModal = document.querySelectorAll(".closeModal");
  closeModal.forEach((close) => {
    close.addEventListener("click", () => {
      document.getElementById("modalEdition").style.display = "none";
      document.querySelector(".modal").style.display = "none";
      document.getElementById("ajoutPhoto").style.display = "none";
    });
  });
}

// modale principale
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
  const ajoutPhoto = document.querySelector(".addProject");
  ajoutPhoto.addEventListener("click", () => {
    const modal = document.querySelector("#ajoutPhoto");
    modal.style.display = "flex";
    modalAjoutPhoto();

    const close = document.querySelector(".modal");
    close.style.display = "none";
    catModal();
  });
}

// modale ajouter une photo
function modalAjoutPhoto() {
  // Arrowback
  const arrowback = document.querySelector(".arrowback");
  arrowback.addEventListener("click", () => {
    document.getElementById("ajoutPhoto").style.display = "none";
    document.querySelector(".modal").style.display = "flex";
  });

  // Sélections des éléments
  const fileInput = document.querySelector('.photo-upload input[type="file"]');
  const imagePreview = document.getElementById("imagePreview");
  const photopreview = document.getElementById("photo-upload-preview");
  const uploadImage = document.querySelector(".photo-upload");
  const form = document.querySelector("#ajoutPhoto form");
  const btnValidate = form.querySelector(".btn-validate");
  const titleInput = form.querySelector('input[type="text"]');
  const catSelect = form.querySelector("select.modalCategories");

  // Reset à chaque ouverture
  imagePreview.src = "";
  imagePreview.style.display = "none";
  photopreview.style.display = "none";
  uploadImage.style.display = "flex";
  titleInput.value = "";
  fileInput.value = "";
  btnValidate.disabled = true;

  // Aperçu image
  fileInput.onchange = function (e) {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreview.style.display = "block";
        photopreview.style.display = "flex";
        uploadImage.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
      imagePreview.style.display = "none";
      photopreview.style.display = "flex";
      uploadImage.style.display = "flex";
    }
    checkFormReady();
  };

  // Activation bouton submit
  function checkFormReady() {
    btnValidate.disabled = !(fileInput.files.length > 0 && titleInput.value.trim() !== "" && catSelect.value !== "");
  }

  // Ajoute la vérification sur chaque champ
  [fileInput, titleInput, catSelect].forEach((input) => {
    input.addEventListener("input", checkFormReady);
    input.addEventListener("change", checkFormReady);
  });
  checkFormReady();

  // Chargement des catégories
  function catModal() {
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((data) => {
        catSelect.innerHTML = "";
        data.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.innerText = category.name;
          catSelect.appendChild(option);
        });
        checkFormReady();
      });
  }
  catModal();
  submitForm();
}

// Envoyer un projet vers l'api / Submit
function submitForm() {
  const submitForm = document.querySelector("#ajoutPhoto form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const image = document.querySelector('.photo-upload input[type="file"]').files[0];
    const title = document.querySelector('input[type="text"]').value;
    const category = document.querySelector("select.modalCategories").value;

    const formData = new FormData();
    formData.append("image", image); // <- Champ attendu par l'API
    formData.append("title", title);
    formData.append("category", category); // <- Champ attendu par l'API

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur API");
        return response.json();
      })
      .then((data) => {
        mainGallery();
        modal(); // recharge la modale après ajout
      })
      .catch((err) => {
        alert("Erreur lors de l'envoi du projet.");
      });
  });
}
// Récupération des projets dans la page
mainGallery();
edition();
modalDisplay();
