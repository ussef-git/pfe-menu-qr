const Article = require('../models/article');

// Création d'un article
const createArticle = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const newArticle = new Article({ name, price, category,description });

        await newArticle.save();
        res.status(201).json({ message: "Article créé avec succès", article: newArticle });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'article", error });
    }
};

// Création de plusieurs articles
/*const createMultipleArticles = async (req, res) => {
    try {
        const articles = req.body; // Liste des articles envoyés par le frontend
        const newArticles = await Article.insertMany(articles); // Enregistrement en masse

        res.status(201).json({ message: "Articles créés avec succès", articles: newArticles });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création des articles", error });
    }
};*/

module.exports = { createArticle/*, createMultipleArticles*/ };