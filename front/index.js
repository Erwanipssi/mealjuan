document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const alphabet = document.getElementById('alphabet');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            displayErrorMessage('Veuillez entrer un terme de recherche.');
            return;
        }
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche de plats.');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error(error);
            displayErrorMessage('Une erreur est survenue lors de la recherche.');
        }
    });

    searchInput.addEventListener('input', async () => {
        const searchTerm = searchInput.value.trim();
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche de recettes.');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error(error);
            displayErrorMessage('Une erreur est survenue lors de la recherche.');
        }
    });

    function displayResults(data) {
        searchResults.innerHTML = '';
        if (!data.meals) {
            searchResults.innerHTML = '<p>Aucune recette trouvée.</p>';
            return;
        }
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        data.meals.forEach(meal => {
            const card = document.createElement('div');
            card.classList.add('card');
    
            const mealImage = document.createElement('img');
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;
            mealImage.classList.add('card-image');
            mealImage.addEventListener('click', () => displayRecipeInstructions(meal.strMeal));
            card.appendChild(mealImage);
    
            const mealName = document.createElement('span');
            mealName.textContent = meal.strMeal;
            mealName.classList.add('card-name');
            card.appendChild(mealName);
    
            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favoris';
            favoriteButton.classList.add('card-favorite-button');
            favoriteButton.addEventListener('click', () => addToFavorites(meal.strMeal));
            card.appendChild(favoriteButton);
    
            cardContainer.appendChild(card);
        });
        searchResults.appendChild(cardContainer);
    }
    
    async function displayRecipeInstructions(mealName) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails de la recette.');
            }
            const data = await response.json();
            const recipeInstructions = data.meals[0].strInstructions;
            alert(recipeInstructions); 
        } catch (error) {
            console.error(error);
            displayErrorMessage('Une erreur est survenue lors de la récupération des détails de la recette.');
        }
    }
    
  
   
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const letterLink = document.createElement('a');
        letterLink.textContent = letter;
        letterLink.href = '#';
        alphabet.appendChild(letterLink);

    
        letterLink.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la recherche de recettes.');
                }
                const data = await response.json();
                displayResults(data);
            } catch (error) {
                console.error(error);
                displayErrorMessage('Une erreur est survenue lors de la recherche.');
            }
        });
    }
    async function addToFavorites(plat) {
        try {
            const response = await fetch('http://localhost:3005/ajouter-plat-favori', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plat }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du plat en favoris.');
            }
            displayModal('Plat ajouté en favoris avec succès !');
        } catch (error) {
            console.error(error);
            displayModal('Ce plat est déjà en favori.');
        }
    }

  
});