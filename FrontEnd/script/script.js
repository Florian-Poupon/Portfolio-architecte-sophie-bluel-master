// Affiche la galerie principale et les filtres dynamiques
function mainGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
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
      // Génération des boutons de filtre
      const filtersName = new Set();
      data.forEach((filter) => {
        filtersName.add(filter.category.name);
      });
      const filters = document.querySelector(".filterBox");
      filters.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.innerText = "Tous";
      allBtn.classList.add("active");
      filters.appendChild(allBtn);
      filtersName.forEach((button) => {
        const filterBtn = document.createElement("button");
        filterBtn.innerText = button;
        filters.appendChild(filterBtn);
      });
      // Gestion du filtrage des projets
      const projets = document.querySelectorAll(".gallery figure");
      const filterButtons = document.querySelectorAll(".filterBox button");
      filterButtons.forEach((buttonClick) => {
        buttonClick.addEventListener("click", (e) => {
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          e.target.classList.add("active");
          const filtre = e.target.textContent;
          projets.forEach((projet) => {
            if (filtre === "Tous" || projet.dataset.category === filtre) {
              projet.style.display = "";
            } else {
              projet.style.display = "none";
            }
          });
        });
      });
    });
}

// Affiche ou masque les boutons d'édition selon l'état de connexion
function edition() {
  const edition = document.querySelectorAll(".edition");
  if (localStorage.getItem("token")) {
    edition.forEach((editButton) => {
      editButton.style.display = "block";
    });
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
  } else {
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

// Gère l'ouverture et la fermeture de la modale principale
function modalDisplay() {
  const openModal = document.querySelector(".modifier");
  openModal.addEventListener("click", () => {
    modal();
    document.getElementById("modalEdition").style.display = "block";
    document.querySelector(".modal").style.display = "flex";
  });
  const closeModal = document.querySelectorAll(".closeModal");
  closeModal.forEach((close) => {
    close.addEventListener("click", () => {
      document.getElementById("modalEdition").style.display = "none";
      document.querySelector(".modal").style.display = "none";
      document.getElementById("ajoutPhoto").style.display = "none";
    });
  });
}

// Affiche la modale principale avec la galerie et la suppression
function modal() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const galleryModal = document.querySelector(".galleryModal");
      galleryModal.innerHTML = "";
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
  const galleryModal = document.querySelector(".galleryModal");
  galleryModal.addEventListener("click", function (e) {
    const btn = e.target.closest(".deleteProject");
    if (btn) {
      const id = btn.dataset.id;
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.ok === true) {
          mainGallery();
          modal(); // recharge la modale après suppression
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

// Affiche la modale d'ajout de photo, l'aperçu et la validation
function modalAjoutPhoto() {
  const arrowback = document.querySelector(".arrowback");
  arrowback.addEventListener("click", () => {
    document.getElementById("ajoutPhoto").style.display = "none";
    document.querySelector(".modal").style.display = "flex";
  });
  // Sélection des éléments du formulaire
  const fileInput = document.querySelector('.photo-upload input[type="file"]');
  const imagePreview = document.getElementById("imagePreview");
  const photopreview = document.getElementById("photo-upload-preview");
  const uploadImage = document.querySelector(".photo-upload");
  const form = document.querySelector("#ajoutPhoto form");
  const btnValidate = form.querySelector(".btn-validate");
  const titleInput = form.querySelector('input[type="text"]');
  const catSelect = form.querySelector("select.modalCategories");
  // Réinitialise le formulaire à chaque ouverture
  imagePreview.src = "";
  imagePreview.style.display = "none";
  photopreview.style.display = "none";
  uploadImage.style.display = "flex";
  titleInput.value = "";
  fileInput.value = "";
  btnValidate.disabled = true;
  // Gère l'aperçu de l'image sélectionnée
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
  // Active ou désactive le bouton de validation
  function checkFormReady() {
    btnValidate.disabled = !(fileInput.files.length > 0 && titleInput.value.trim() !== "" && catSelect.value !== "");
  }
  // Ajoute la vérification sur chaque champ du formulaire
  [fileInput, titleInput, catSelect].forEach((input) => {
    input.addEventListener("input", checkFormReady);
    input.addEventListener("change", checkFormReady);
  });
  checkFormReady();
  // Charge dynamiquement les catégories dans le select
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

// Gère l'envoi du formulaire d'ajout de projet
function submitForm() {
  const form = document.querySelector("#ajoutPhoto form");
  if (!form) return;
  if (form.getAttribute("data-listener") === "true") return;
  form.setAttribute("data-listener", "true");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    var fileInput = /** @type {HTMLInputElement} */ (form.querySelector('.photo-upload input[type="file"]'));
    var titleInput = /** @type {HTMLInputElement} */ (form.querySelector('input[type="text"]'));
    var catSelect = /** @type {HTMLSelectElement} */ (form.querySelector("select.modalCategories"));
    if (!fileInput || !titleInput || !catSelect) return;
    var image = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    var title = titleInput.value;
    var category = catSelect.value;
    if (!image || !title || !category) return;
    var formData = new FormData();
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
      .then(function (response) {
        if (!response.ok) throw new Error("Erreur API");
        return response.json();
      })
      .then(function (data) {
        mainGallery();
        modal(); // recharge la modale après ajout
        // Réinitialise le formulaire et l'aperçu
        /** @type {HTMLFormElement} */ (form).reset();
        var imagePreview = document.getElementById("imagePreview");
        var photopreview = document.getElementById("photo-upload-preview");
        var uploadImage = /** @type {HTMLElement} */ (document.querySelector(".photo-upload"));
        if (imagePreview) imagePreview.style.display = "none";
        if (photopreview) photopreview.style.display = "none";
        if (uploadImage) uploadImage.style.display = "flex";
      })
      .catch(function (err) {
        alert("Erreur lors de l'envoi du projet.");
      });
  });
}

// Initialisation
mainGallery();
edition();
modalDisplay();
