document.addEventListener('DOMContentLoaded', (event) => {
    const apprenantsContainer = document.getElementById('apprenant-cards');
    const searchInput = document.getElementById('search');
    let apprenantsData = []; // Stocker les données des apprenants
    let promotionMap = {}; // Définir promotionMap dans le scope global
    let competencesMap = {}; // Définir competencesMap dans le scope global

    // Fetch les données des promotions et les stocker dans une map pour une recherche rapide
    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/promotions')
        .then(response => response.json())
        .then(promotions => {
            promotions.forEach(promotion => {
                promotionMap[promotion.id] = promotion.slug;
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
                            apprenantsData = apprenants; // Stocker les données des apprenants pour le filtrage
                            displayApprenants(apprenants); // Afficher les apprenants initiaux
                        })
                        .catch(error => console.error('Erreur:', error));
                })
                .catch(error => console.error('Erreur:', error));
        })
        .catch(error => console.error('Erreur:', error));

    // Fonction pour afficher les apprenants
    function displayApprenants(apprenants) {
        apprenantsContainer.innerHTML = ''; // Vider le conteneur
        apprenants.forEach(apprenant => {
            const promotionId = apprenant.promotions[0];
            const promotionName = promotionMap[promotionId] || 'Unknown';

            const competencesElements = apprenant.competences.map(skillId => {
                const skillName = competencesMap[skillId] || 'Unknown';
                return `<span class="skill">${skillName}</span>`;
            });

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h2 class="name">${apprenant.title.rendered}</h2>
                <img class="profilePic" src="${apprenant.image}"/>
                <p class="promo">Promotion: ${promotionName}</p>
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

    // Écouteur d'événement pour la recherche
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredApprenants = apprenantsData.filter(apprenant => 
            apprenant.title.rendered.toLowerCase().includes(searchValue)
        );
        displayApprenants(filteredApprenants);
    });
});
