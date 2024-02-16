const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require ('cors');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

app.get('/todos', (req, res) => {
    connection.query('SELECT * FROM todo', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des Todos.' });
        } else {
            res.json(results);
        }
    });
});

app.post('/todos', (req, res) => {
    const { titre, description, categorie } = req.body;

    if (!titre || !description || !categorie) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const todo = { titre, description, categorie };

    connection.query('INSERT INTO todo SET ?', todo, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de l\'insertion de la Todo.' });
        } else {
            res.status(201).json({ message: 'Todo insérée avec succès.' });
        }
    });
});


app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const { titre, description, categorie } = req.body;

    if (!titre || !description || !categorie) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const updatedTodo = { titre, description, categorie };

    connection.query('UPDATE todo SET ? WHERE id = ?', [updatedTodo, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la Todo.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'La Todo spécifiée n\'existe pas.' });
        } else {
            res.json({ message: 'Todo mise à jour avec succès.' });
        }
    });
});


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM todo WHERE id = ?', id, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la suppression de la Todo.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'La Todo spécifiée n\'existe pas.' });
        } else {
            res.status(204).end();
        }
    });
});


app.get('/todos', (req, res) => {
    const { titre, categorie } = req.query;
    let queryString = 'SELECT * FROM todo';

    if (titre && !categorie) {
        queryString += ` WHERE titre LIKE '%${titre}%'`;
    } else if (!titre && categorie) {
        queryString += ` WHERE categorie LIKE '%${categorie}%'`;
    } else if (titre && categorie) {
        queryString += ` WHERE titre LIKE '%${titre}%' AND categorie LIKE '%${categorie}%'`;
    }

    connection.query(queryString, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des Todos.' });
        } else {
            res.json(results);
        }
    });
});



app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});