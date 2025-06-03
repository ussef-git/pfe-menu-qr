const express = require("express");
const dbRoutes = express.Router();
const mongoose = require("mongoose");
 // Crée un routeur express
// Définition du schéma et modèle MongoDB
const DataSchema = new mongoose.Schema({
    name: String,
    value: Number // Ajoute un champ supplémentaire si nécessaire
});

const DataModel = mongoose.model("Data", DataSchema);

// Route GET pour récupérer les données de MongoDB
dbRoutes.get("/",/*authMiddleware,*/ async (req, res) => {
    try {
        const data = await DataModel.find();

        console.log("✅ Données récupérées :", data); // Affichage dans la console

        if (!data /*|| data.length ===0*/) {
            return res.status(404).json({ message: "⚠️ Aucune donnée trouvée dans la base !" });
        }

        res.json(data);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error.message);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

module.exports = dbRoutes;


