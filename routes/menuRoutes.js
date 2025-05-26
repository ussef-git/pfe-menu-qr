const express = require('express');
const menuRoutes = express.Router();
const Menu = require('../models/menu'); // Import correct du modèle

// Route POST pour créer un menu
menuRoutes.post('/', async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Vérifier que tous les champs sont fournis
        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
        }

        // Créer et enregistrer le menu
        const newMenu = new Menu({ name, description, price, category });
        const savedMenu = await newMenu.save();

        res.status(201).json({ success: true, data: savedMenu });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route GET pour récupérer tous les menus
menuRoutes.get("/", async (req, res) => {
    try {
        const menus = await Menu.find(); // Correction ici
        res.json({ success: true, data: menus });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});


menuRoutes.delete("/", async (req, res) => {
    try {
        const { menuName, categories } = req.body;

        if (!menuName || !categories) {
            return res.status(400).json({ success: false, message: "Veuillez fournir le nom du menu et les catégories à supprimer." });
            return res.status(400).json({ success: false, message: "Veuillez fournir le nom du menu et de la catégorie à supprimer." });
        }
   
        const updatedMenu = await Menu.findOneAndUpdate(
            { name: menuName },
            { $pull: { categories: categoryName } }, // Supprime la catégorie
            { new: true }
        );

        if (!updatedMenu) {
            return res.status(404).json({ success: false, message: "Menu non trouvé." });
        }

        res.status(200).json({ success: true, message: `La catégorie '${categoryName}' a été supprimée du menu '${menuName}'.` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
});



module.exports = menuRoutes;