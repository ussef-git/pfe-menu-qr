const Menu = require("../models/menu");

// Créer un menu
const createMenu = async (req, res) => {
    try {
        const { title, categories } = req.body;

        // Vérifier que les champs sont bien fournis
        if (!title || !categories) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
        }

        // Créer et enregistrer le menu
        const newMenu = new Menu({ title, categories });
        const savedMenu = await newMenu.save();

        res.status(201).json({ success: true, data: savedMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer tous les menus
const getMenus = async (req, res) => {
    try {
        const menus = await Menu.find().populate("categories"); // Inclure les catégories associées
        res.json({ success: true, data: menus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer un menu par son ID
const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id).populate("categories");
        if (!menu) return res.status(404).json({ success: false, message: "Menu introuvable !" });

        res.json({ success: true, data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mettre à jour un menu
const updateMenu = async (req, res) => {
    try {
        const { title, categories } = req.body;

        const updatedMenu = await Menu.findByIdAndUpdate(
            req.params.id,
            { title, categories },
            { new: true, runValidators: true }
        );

        if (!updatedMenu) return res.status(404).json({ success: false, message: "Menu introuvable !" });

        res.json({ success: true, data: updatedMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Supprimer un menu
const deleteMenu = async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedMenu) return res.status(404).json({ success: false, message: "Menu introuvable !" });

        res.json({ success: true, message: "Menu supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createMenu, getMenus, getMenuById, updateMenu, deleteMenu };