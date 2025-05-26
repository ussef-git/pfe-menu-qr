const mongoose = require('mongoose');

// Déclarer le schéma AVANT de l'utiliser
const menuSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },  // Titre du menu (ex: "Menu du jour")
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie' 
    }] // Liste des catégories associées
});

// Utiliser le schéma pour créer le modèle
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;