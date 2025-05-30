const mongoose = require('mongoose');

// Définition du schéma de catégorie
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Nom obligatoire
        unique: true, // Évite les doublons de catégories
        trim: true // Supprime les espaces inutiles
    },
    articles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article' // Référence au modèle Article
    }]
}, { timestamps: true }); // Ajoute automatiquement createdAt et updatedAt

// Création du modèle
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;