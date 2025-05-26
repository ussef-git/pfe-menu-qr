const  Categorie= require('../models/categorie'); //importer le modèle de la base de données
const express = require('express'); //importer express  
const categoriesRoutes = express.Router(); //créer un routeur express
 

categoriesRoutes.post('/', async (req, res) => {
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
categoriesRoutes.get('/',async (req,res) =>{
    const categories = await Categorie.find(); //chercher toutes les catégories dans la base de données
       if(!categories){
           res.status(500).json({success:false});
   
       }
       res.status(200).send(categories);
   });
  categoriesRoutes.delete('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Veuillez fournir un nom de catégorie à supprimer." });
        }

        const deletedCategorie = await Categorie.findOneAndDelete({ name });

        if (!deletedCategorie) {
            return res.status(404).json({ success: false, message: "Catégorie non trouvée." });
        }

        res.status(200).json({ success: true, message: "Catégorie supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
module.exports=categoriesRoutes;