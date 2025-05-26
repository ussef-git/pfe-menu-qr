const mongoose = require('mongoose'); // Connexion à la base de données
const Categorie = require('./categorie'); // Importer le modèle de catégorie
const articleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true // Obligatoire
    },
    price: {
        type: Number,
        required: true, // Obligatoire
        min: 0 // Prix ne peut pas être négatif
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie', // Référence à une catégorie existante
        required: true // Un article doit toujours être associé à une catégorie
    },
    description :{
        type :[String],
        required: true  // Obligatoire
    }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article; // Exporter le modèle