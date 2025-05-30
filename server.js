const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à la base de données

require('dotenv').config();// Charger les variables d’environnement



const app = require("./app");


//const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);



// Middleware
app.use(express.json());





// Fonction pour démarrer le serveur après connexion à MongoDB
const startServer = async () => {
  try {
    await connectDB();
    // Attendre la connexion avant de lancer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur :", error.message);
    process.exit(1); // Arrêter le processus en cas d'échec critique
  }
};


/*async function testDB() {
  try {
    const admins = await Admin.find();
    console.log("📌 Données récupérées :", admins);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
  }
}

testDB();*/
startServer();