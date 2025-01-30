document.addEventListener('DOMContentLoaded', (event) => {
    const apprenantsContainer = document.getElementById('apprenant-cards');
    const searchInput = document.getElementById('search');
    const checkboxes = document.querySelectorAll('.checkbox'); // Sélection des cases à cocher
    let apprenantsData = []; // Stocker les données des apprenants
    let promotionMap = {}; 
    let competencesMap = {}; 

    // Récupération des données des promotions et stockage des années associées
    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/promotions')
        .then(response => response.json())
        .then(promotions => {
            promotions.forEach(promotion => {
                const year = promotion.slug.match(/\d{4}/); // Extraction de l'année depuis le slug
                if (year) {
                    promotionMap[promotion.id] = year[0]; // Stocke l'année associée à l'ID
                }
            });

            fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/competences')
                .then(response => response.json())
                .then(competences => {
                    competences.forEach(competence => {
                        competencesMap[competence.id] = competence.name;
                    });

                    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/apprenants?per_page=100')
                        .then(response => response.json())
                        .then(apprenants => {
                            apprenantsData = apprenants;
                            filterAndDisplayApprenants(); // Afficher les apprenants selon le filtre
                        })
                        .catch(error => console.error('Erreur:', error));
                })
                .catch(error => console.error('Erreur:', error));
        })
        .catch(error => console.error('Erreur:', error));

    // Fonction pour afficher les apprenants filtrés
    function filterAndDisplayApprenants() {
        // Récupérer les années sélectionnées
        const selectedYears = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Filtrer les apprenants en fonction des années sélectionnées
        const filteredApprenants = apprenantsData.filter(apprenant => {
            const promotionId = apprenant.promotions[0]; // ID de la promotion
            const promotionYear = promotionMap[promotionId]; // Récupérer l'année associée
            return selectedYears.includes(promotionYear); // Vérifier si l'année est cochée
        });

        // Afficher les apprenants filtrés
        displayApprenants(filteredApprenants);
    }

    // Fonction pour afficher les apprenants
    function displayApprenants(apprenants) {
        apprenantsContainer.innerHTML = ''; // Vider le conteneur
        apprenants.forEach(apprenant => {
            const promotionId = apprenant.promotions[0];
            const promotionYear = promotionMap[promotionId] || 'Inconnue';

            const competencesElements = apprenant.competences.map(skillId => {
                const skillName = competencesMap[skillId] || 'Inconnue';
                return `<span class="skill">${skillName}</span>`;
            });

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h2 class="name">${apprenant.title.rendered}</h2>
                <img class="profilePic" src="${apprenant.image}"/>
                <p class="promo">Promotion: ${promotionYear}</p>
                <p class="skills">${competencesElements.join('')}</p>
                <div class="links">
                    <a href="${apprenant.urlgit}" target="_blank"><img src="image/gith.png"></a>
                    <a href="${apprenant.linkedin}" target="_blank"><img src="image/lindk.png"></a>
                    <a href="${apprenant.cv}" target="_blank"><img src="image/CV.jpg"></a>
                    <a href="${apprenant.portfolio}" target="_blank"><img src="image/PF.png"></a>
                </div>
            `;
            apprenantsContainer.appendChild(card);
        });
    }

    // Ajouter un écouteur d'événements sur les cases à cocher
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterAndDisplayApprenants);
    });

    // Écouteur d'événement pour la recherche
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredApprenants = apprenantsData.filter(apprenant => 
            apprenant.title.rendered.toLowerCase().includes(searchValue)
        );
        displayApprenants(filteredApprenants);
    });
});
/*petit télé*/ 
function updateClock() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    document.getElementById('date').textContent = date;
    document.getElementById('time').textContent = time;
  }
  // Met à jour l'horloge toutes les secondes
  setInterval(updateClock, 1000);

  // Initialise l'horloge au chargement de la page
  updateClock(); 
