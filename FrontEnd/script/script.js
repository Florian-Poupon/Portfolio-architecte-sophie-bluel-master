fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    // création des projets depuis API
    const gallery = document.querySelector(".gallery");
    data.forEach((work) => {
      const projet = document.createElement("figure");
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

// mode édition
const edition = document.querySelectorAll(".edition");

if (localStorage.getItem("token")) {
  // Affiche les boutons .edition
  edition.forEach((editButton) => {
    editButton.style.display = "block";
  });
} else {
  // Cache les boutons si pas connecté
  edition.forEach((editButton) => {
    editButton.style.display = "none";
  });
}
