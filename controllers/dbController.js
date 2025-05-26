const DataModel = require("../models/dbm"); // Assure-toi que ce modèle est bien défini

// Récupérer toutes les données
const getAllData = async (req, res) => {
    try {
        const data = await DataModel.find();

        console.log("✅ Données récupérées :", data);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "⚠️ Aucune donnée trouvée dans la base !" });
        }

        res.json(data);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error.message);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

module.exports = { getAllData };