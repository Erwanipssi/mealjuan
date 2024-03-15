const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3005;

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

app.get('/favoris', (req, res) => {
    connection.query('SELECT id, plats FROM favoris', (error, results) => {
        if (error) {
            console.error(error); 
            res.status(500).json({ message: 'Erreur lors de la récupération des favoris.' });
        } else {
            res.json(results);
        }
    });
});

app.post('/ajouter-plat-favori', (req, res) => {
    const { plat } = req.body;

   
    connection.query('SELECT * FROM favoris WHERE plats = ?', [plat], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la vérification des favoris.' });
        } else if (results.length > 0) {
            res.status(400).json({ message: 'Ce plat est déjà en favori.' });
        } else {
            
            connection.query('INSERT INTO favoris (plats) VALUES (?)', [plat], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Erreur lors de l\'ajout du plat en favori.' });
                } else {
                    res.status(200).json({ message: 'Plat ajouté en favori avec succès.' });
                }
            });
        }
    });
});

app.delete('/favoris/:id', (req, res) => {
    const favorisId = req.params.id;

    connection.query('DELETE FROM favoris WHERE id = ?', favorisId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la suppression du favori.' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Le favori spécifié n\'existe pas.' });
        } else {
            res.status(200).json({ message: 'Favori supprimé avec succès.' });
        }
    });
});
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

