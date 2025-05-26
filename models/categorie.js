const mongoose = require('mongoose');

// Définition du schéma de catégorie
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Nom obligatoire
        unique: true, // Évite les doublons de catégories
        trim: true // Supprime les espaces inutiles
    }
}, { timestamps: true }); // Ajoute automatiquement createdAt et updatedAt

// Création du modèle
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;