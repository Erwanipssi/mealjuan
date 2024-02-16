document.addEventListener('DOMContentLoaded', () => {
    const todoListDiv = document.getElementById('todoList');
    const form = document.querySelector('.form');

    
    async function fetchTodos() {
        try {
            const response = await fetch('http://localhost:3001/todos');
            const todos = await response.json();
            displayTodos(todos);
        } catch (error) {
            console.error('Erreur lors de la récupération des Todos:', error);
        }
    }


    function displayTodos(todos) {
        todoListDiv.innerHTML = ''; 
    
        todos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');
    
            const titreElement = document.createElement('h2');
            titreElement.textContent = `Titre: ${todo.titre}`;
    
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Description: ${todo.description}`;
    
            const categorieElement = document.createElement('p');
            categorieElement.textContent = `Catégorie: ${todo.categorie}`;
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));
    
            const editButton = document.createElement('button');
            editButton.textContent = 'Modifier';
            editButton.addEventListener('click', () => editTodo(todo));
    
            todoDiv.appendChild(titreElement);
            todoDiv.appendChild(descriptionElement);
            todoDiv.appendChild(categorieElement);
            todoDiv.appendChild(deleteButton);
            todoDiv.appendChild(editButton);
    
            todoListDiv.appendChild(todoDiv);
        });
    }
   
    async function deleteTodo(id) {
        try {
            const response = await fetch(`http://localhost:3001/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Impossible de supprimer la Todo.');
            }

            console.log('Todo supprimée avec succès.');
            fetchTodos(); 
        } catch (error) {
            console.error('Erreur lors de la suppression de la Todo:', error);
        }
    }

   
    function editTodo(todo) {
        
        console.log('Édition de la Todo:', todo);
    }

   
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const titre = document.getElementById('title').value;
        const categorie = document.getElementById('categorie').value;
        const description = document.getElementById('description').value;
    
        try {
            const response = await fetch('http://localhost:3001/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ titre, description, categorie })
            });
            
            if (!response.ok) {
                throw new Error('Impossible d\'ajouter la Todo.');
            }

            console.log('Nouvelle Todo ajoutée avec succès.');
            fetchTodos(); 
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la Todo:', error);
        }
    });

    searchButton.addEventListener('click', async () => {
        const searchValue = searchInput.value;
        const criteria = searchCriteria.value;
    
        try {
            const response = await fetch(`http://localhost:3001/todos?${criteria}=${searchValue}`);
            const todos = await response.json();
            displayTodos(todos);
        } catch (error) {
            console.error('Erreur lors de la recherche des Todos:', error);
        }
    });
    
    fetchTodos();
});