function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // On parse le JSON
        return response.json();
      } else {
        // Affiche l’erreur de connexion
        const error = document.querySelector(".error");
        error.style.display = "block";
        // Stoppe la chaine
        throw new Error("Identifiants invalides");
      }
    })
    .then((data) => {
      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);

      // Efface l’erreur si affichée
      const error = document.querySelector(".error");
      error.style.display = "none";

      // Redirige vers index
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error);
    });
}

// submit login
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
