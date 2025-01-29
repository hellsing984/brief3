document.addEventListener('DOMContentLoaded', (event) => {
  const apprenantsContainer = document.getElementById('apprenant-cards');
  const burgerButton = document.getElementById('burger-button');
  const burgerMenu = document.querySelector('.burger-menu');
  const checkboxes = document.querySelectorAll('.checkbox');

  // Fonction pour afficher/masquer le menu burger
  burgerButton.addEventListener('click', () => {
      burgerMenu.classList.toggle('visible'); // Ajouter une classe pour afficher/masquer le menu
  });

  // Fonction pour gérer l'état des cases à cocher
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
          // Logique pour afficher/masquer des éléments en fonction de l'état des cases
          const isChecked = checkbox.checked;
          const year = checkbox.parentElement.querySelector('p').textContent;
          if (isChecked) {
              console.log(`${year} sélectionné`);
          } else {
              console.log(`${year} désélectionné`);
          }
      });
  });

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

                              // Trouver les noms des compétences et attribuer des classes de couleurs
                              const competencesElements = apprenant.competences.map(skillId => {
                                  const skillName = competencesMap[skillId] || 'Unknown';
                                  let colorClass;
                                  switch(skillName) {
                                      case 'HTML5':
                                          colorClass = 'font-semibold bg-red-400';
                                          break;
                                      case 'CSS':
                                          colorClass = 'font-semibold bg-sky-500';
                                          break;
                                      case 'TailwindCSS':
                                          colorClass = 'font-semibold bg-teal-500';
                                          break;
                                      case 'JavaScript':
                                          colorClass = 'font-semibold bg-yellow-500';
                                          break;
                                      case 'Figma':
                                          colorClass = 'font-semibold bg-purple-600';
                                          break;
                                      default:
                                          colorClass = 'font-semibold bg-gray-800';
                                  }
                                  return `<span class="skill ${colorClass}">${skillName}</span>`;
                              });

                              // Créer un élément de carte
                              const card = document.createElement('div');
                              card.className = 'card';

                              // Remplir la carte avec les données de l'apprenant
                              card.innerHTML = `
                                  <div class="card-inner">
                                      <div class="card-front">
                                          <h2 class="name">${apprenant.nom}<br>${apprenant.prenom}</h2>
                                          <img class="profilePic" src="${apprenant.image}"/>
                                          <p class="promo">Promotion: ${promotionName}</p>
                                          <p class="skills">${competencesElements.join('')}</p>
                                          <div class="links">
                                              <a href="${apprenant.urlgit}" target="_blank"><img src="image/gith.png"></a>
                                               <a href="${apprenant.linkedin}" target="_blank"><img src="image/lindk.png" alt="LinkedIn Logo"></a>
                                              <a href="${apprenant.cv}" target="_blank"><img src="image/CV.jpg"></a>
                                              <a href="${apprenant.portfolio}" target="_blank"><img src="image/PF.png"></a>
                                          </div>
                                      </div>
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

document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checkbox');
    const cards = document.querySelectorAll('.card');

    function filterCards() {
        const selectedYears = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        cards.forEach(card => {
            const year = card.getAttribute('data-year');
            
            // Vérifie si la carte a un data-year valide
            if (year) {
                const isVisible = selectedYears.length === 0 || selectedYears.includes(year);
                card.style.display = isVisible ? '' : 'none';
            } else {
                // Si aucune année n'est définie, cacher par défaut
                card.style.display = 'none';
            }
        });
    }
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', filterCards));
    // Lancer une première fois au chargement
    filterCards();
});

/*  barre de recherche*/
document.getElementById('search').addEventListener('input', function() {
    let searchValue = this.value.toLowerCase();
    let cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        let title = card.getAttribute('data-title').toLowerCase();
        if (title.includes(searchValue)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
});

