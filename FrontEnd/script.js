fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    // création des projets depuis API
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    data.forEach((work) => {
      const projet = document.createElement("figure");
      gallery.appendChild(projet);
      const imgWork = document.createElement("img");
      imgWork.src = work.imageUrl;
      projet.appendChild(imgWork);
      const titleWork = document.createElement("figcaption");
      titleWork.innerText = work.title;
      projet.appendChild(titleWork);
    });
    // récupérer les filtres éxistants
    const filtersName = new Set();
    data.forEach((filter) => {
      filtersName.add(filter.category.name);
    });
    // Création des filtres

    const filters = document.querySelector(".filterBox");

    filtersName.forEach((button) => {
      const filterBtn = document.createElement("button");
      filterBtn.innerText = button;
      filters.appendChild(filterBtn);
    });

    // Function de filtrage
  });
