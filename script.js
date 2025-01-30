document.addEventListener('DOMContentLoaded', (event) => {
    const apprenantsContainer = document.getElementById('apprenant-cards');
    const searchInput = document.getElementById('search');
    const checkboxes = document.querySelectorAll('.checkbox');
    const competenceButtons = document.querySelectorAll('.competence-button');
    
    let apprenantsData = [];
    let promotionMap = {};
    let competencesMap = {}; // Associe les IDs aux noms des compétences
    let selectedCompetences = new Set(); // Stocke les compétences activées

    // Récupération des compétences
    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/competences')
        .then(response => response.json())
        .then(competences => {
            competences.forEach(competence => {
                competencesMap[competence.id] = competence.name; // Associe ID → Nom
            });

            // Récupération des promotions
            return fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/promotions');
        })
        .then(response => response.json())
        .then(promotions => {
            promotions.forEach(promotion => {
                const year = promotion.slug.match(/\d{4}/);
                if (year) {
                    promotionMap[promotion.id] = year[0];
                }
            });

            // Récupération des apprenants
            return fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/apprenants?per_page=100');
        })
        .then(response => response.json())
        .then(apprenants => {
            apprenantsData = apprenants;
            filterAndDisplayApprenants();
        })
        .catch(error => console.error('Erreur:', error));

    // Gérer le clic sur les boutons de compétences
    competenceButtons.forEach(button => {
        button.addEventListener('click', function () {
            const competenceName = this.dataset.competence;

            if (selectedCompetences.has(competenceName)) {
                selectedCompetences.delete(competenceName); // Désélectionner
                button.classList.remove('active'); 
            } else {
                selectedCompetences.add(competenceName); // Sélectionner
                button.classList.add('active'); 
            }

            filterAndDisplayApprenants(); // Mettre à jour l'affichage
        });
    });

    // Fonction pour filtrer et afficher les apprenants
    function filterAndDisplayApprenants() {
        const selectedYears = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const filteredApprenants = apprenantsData.filter(apprenant => {
            const promotionId = apprenant.promotions[0];
            const promotionYear = promotionMap[promotionId];
            const hasValidYear = selectedYears.includes(promotionYear);

            // Vérifier si l'apprenant possède au moins une des compétences sélectionnées
            const hasSelectedCompetence = selectedCompetences.size === 0 || 
                apprenant.competences.some(skillId => selectedCompetences.has(competencesMap[skillId]));

            return hasValidYear && hasSelectedCompetence;
        });

        displayApprenants(filteredApprenants);
    }

    // Fonction pour afficher les apprenants
    function displayApprenants(apprenants) {
        apprenantsContainer.innerHTML = '';
        apprenants.forEach(apprenant => {
            const promotionId = apprenant.promotions[0];
            const promotionYear = promotionMap[promotionId] || 'Inconnue';

            const competencesElements = apprenant.competences.map(skillId => {
                const skillName = competencesMap[skillId] || 'Inconnue';
                return `<span class="skill">${skillName}</span>`;
            }).join('');

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h2 class="name">${apprenant.title.rendered}</h2>
                <img class="profilePic" src="${apprenant.image}"/>
                <p class="promo">Promotion: ${promotionYear}</p>
                <p class="skills">${competencesElements}</p>
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

    // Écouteur pour la recherche
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredApprenants = apprenantsData.filter(apprenant => 
            apprenant.title.rendered.toLowerCase().includes(searchValue)
        );
        displayApprenants(filteredApprenants);
    });
});
