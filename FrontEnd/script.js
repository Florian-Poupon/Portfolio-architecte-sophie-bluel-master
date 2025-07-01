fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
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
  });
