
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/apprenants"; // API
  const container = document.getElementById("apprenant-cards"); // Conteneur des cartes
  const searchInput = document.querySelector(".search-bar input"); // Barre de recherche
  const checkboxes = document.querySelectorAll(".sidebar1 .checkbox"); // Filtres des promotions

  let allApprenants = []; // Stocke les données de l'API

  // Récupération des données depuis l'API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Erreur lors de la récupération des données.");
      return response.json();
    })
    .then((data) => {
      allApprenants = data; // Stocker les données
      displayApprenants(allApprenants); // Afficher les apprenants
    })
    .catch((error) => console.error("Erreur : ", error));

  // Affiche les apprenants dans le conteneur
  function displayApprenants(apprenants) {
    container.innerHTML = ""; // Nettoyer le conteneur
    if (apprenants.length === 0) {
      container.innerHTML = "<p>Aucun apprenant trouvé.</p>";
      return;
    }

    apprenants.forEach((apprenant) => {
      const card = document.createElement("div");
      card.classList.add("apprenant-card"); // Classe pour styliser les cartes
      card.innerHTML = `
        <img src="${apprenant.image || "https://via.placeholder.com/100"}" alt="Photo de ${apprenant.nom}">
        <h3>${apprenant.title.rendered}</h3>
        <p><strong>Promotion :</strong> ${apprenant.promotion || "Non précisé"}</p>
        <p><strong>Compétences :</strong> ${apprenant.competences ? apprenant.competences.join(", ") : "Aucune"}</p>
      `;
      container.appendChild(card);
    });
  }

  // Filtre les apprenants en fonction des critères
  function filterApprenants() {
    const searchValue = searchInput.value.toLowerCase(); // Valeur de la recherche
    const selectedPromotions = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked) // Récupère les promotions cochées
      .map((checkbox) => checkbox.nextElementSibling.textContent);

    const filteredApprenants = allApprenants.filter((apprenant) => {
      const matchesSearch = apprenant.nom.toLowerCase().includes(searchValue); // Filtre par nom
      const matchesPromotion =
        selectedPromotions.length === 0 || selectedPromotions.includes(apprenant.promotion); // Filtre par promotion

      return matchesSearch && matchesPromotion;
    });

    displayApprenants(filteredApprenants);
  }

  // Événements pour la recherche et les filtres
  searchInput.addEventListener("input", filterApprenants);
  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", filterApprenants));
});

