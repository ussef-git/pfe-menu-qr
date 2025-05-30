const CategoryModel = require("../models/categorie");

// Récupérer toutes les catégories
const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la récupération des catégories", error: error.message });
    }
};

// Créer une catégorie
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new CategoryModel({ name });
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la catégorie", error: error.message });
    }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CategoryModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Catégorie non trouvée" });
        }
        res.json({ success: true, message: "Catégorie supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};

module.exports = { getAllCategories, createCategory, deleteCategory };