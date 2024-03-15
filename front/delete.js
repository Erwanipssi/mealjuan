document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3005/favoris');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des favoris.');
        }
        const data = await response.json();
        displayFavorites(data);
    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la récupération des favoris.');
    }
});

function displayFavorites(data) {
    const favorisContainer = document.getElementById('favorisContainer');
    favorisContainer.innerHTML = '';
    data.forEach(favori => {
        const favoriItem = document.createElement('div');
        favoriItem.classList.add('favori-item');

        const nomPlat = document.createElement('span');
        nomPlat.textContent = favori.plats; 
        nomPlat.classList.add('favori-name');
        favoriItem.appendChild(nomPlat);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => displayModal(favori.id));
        favoriItem.appendChild(deleteButton);

        favorisContainer.appendChild(favoriItem);
    });
}

async function deleteFavorite(favoriId) {
    try {
        const response = await fetch(`http://localhost:3005/favoris/${favoriId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du favori.');
        }
        closeModal(); 

        const updatedResponse = await fetch('http://localhost:3005/favoris');
        const updatedData = await updatedResponse.json();
        displayFavorites(updatedData);
    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la suppression du favori.');
    }
}

const modal = document.getElementById('myModal');
const confirmDeleteButton = document.getElementById('confirmDelete');
const cancelDeleteButton = document.getElementById('cancelDelete');

function displayModal(favoriId) {
    modal.style.display = 'block';
   
    confirmDeleteButton.addEventListener('click', () => deleteFavorite(favoriId));
}

function closeModal() {
    modal.style.display = 'none';
  
    confirmDeleteButton.removeEventListener('click', deleteFavorite);
}

cancelDeleteButton.addEventListener('click', closeModal);