const  Categorie= require('../models/categorie'); //importer le modèle de la base de données
const express = require('express'); //importer express  
const categoriesRoutes = express.Router(); //créer un routeur express
 const authMiddleware = require('../middlewares/authMiddleware'); // Importer le middleware d'authentification

categoriesRoutes.post('/', authMiddleware,async (req, res) => {
    try {
        const { name } = req.body;

        // Vérifier que le nom est fourni
        if (!name) {
            return res.status(400).json({ success: false, message: "Le nom de la catégorie est requis." });
        }

        // Créer et enregistrer la catégorie
        const categorie = new Categorie({ name });
        const savedCategorie = await categorie.save();

        res.status(201).json({ success: true, data: savedCategorie });

    } catch (error) {
        console.error("Erreur MongoDB :", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
categoriesRoutes.get('/', authMiddleware, async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
  categoriesRoutes.delete('/:id', authMiddleware,async (req, res) => {
    try {
      

        const deletedCategorie = await Categorie.findByIdAndDelete( req.params.id );

        if (!deletedCategorie) {
            return res.status(404).json({ success: false, message: "Catégorie non trouvée." });
        }

        res.status(200).json({ success: true, message: "Catégorie supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
module.exports=categoriesRoutes;