const CategoryModel = require("../models/categorie");

// Récupérer toutes les catégories
const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de la récupération des catégories", error: error.message });
    }
};

module.exports = { getAllCategories };