document.addEventListener('DOMContentLoaded', (event) => {
    const apprenantsContainer = document.getElementById('apprenant-cards');

    // Fetch les données des promotions et les stocker dans une map pour une recherche rapide
    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/promotions')
        .then(response => response.json())
        .then(promotions => {
            // Créer une map des promotions pour une recherche rapide
            const promotionMap = {};
            promotions.forEach(promotion => {
                promotionMap[promotion.id] = promotion.slug;
            });

            // Fetch les compétences et les stocker dans une map pour une recherche rapide
            fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/competences')
                .then(response => response.json())
                .then(competences => {
                    // Créer une map des compétences pour une recherche rapide
                    const competencesMap = {};
                    competences.forEach(competence => {
                        competencesMap[competence.id] = competence.name;
                    });

                    // Fetch la liste des apprenants avec une limite de 100 par page
                    fetch('http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/apprenants?per_page=100')
                        .then(response => response.json())
                        .then(apprenants => {
                            apprenants.forEach(apprenant => {
                                // Trouver le nom de la promotion
                                const promotionId = apprenant.promotions[0]; // Supposer que chaque apprenant a une promotion
                                const promotionName = promotionMap[promotionId] || 'Unknown';

                                // Trouver les noms des compétences
                                const competencesElements = apprenant.competences.map(skillId => {
                                    const skillName = competencesMap[skillId] || 'Unknown';
                                    return `<span class="skill">${skillName}</span>`;
                                });

                                // Créer un élément de carte
                                const card = document.createElement('div');
                                card.className = 'card';

                                // Remplir la carte avec les données de l'apprenant
                                card.innerHTML = `
                                    <h2 class="name">${apprenant.nom}<br>${apprenant.prenom}</h2>
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

                                // Ajouter la carte au conteneur
                                apprenantsContainer.appendChild(card);
                            });
                        })
                        .catch(error => console.error('Erreur:', error)); // Gérer les erreurs pour le fetch des apprenants
                })
                .catch(error => console.error('Erreur:', error)); // Gérer les erreurs pour le fetch des compétences
        })
        .catch(error => console.error('Erreur:', error)); // Gérer les erreurs pour le fetch des promotions
});

// Récupérer l'élément de la barre de recherche
const searchInput = document.getElementById("recherche");
// URL de l'API, avec ajout du paramètre de recherche pour filtrer les promotions
const apiUrl = `http://portfolios.ruki5964.odns.fr/wp-json/wp/v2/promotions?search=${encodeURIComponent(query)}`;

  