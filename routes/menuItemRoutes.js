const express = require('express');
const { createArticle, createMultipleArticles}=require('../controllers/menuItemControllers'); 
const Article = require('../models/menuItem'); // Importer le modèle d'article//const { createCategory } = require("../controllers/categoryControllers");
const menuItemRoutes = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Importer le middleware d'authentification
/*router.post('/articles',createArticle);*/
//router.post('/articles/multiple',createMultipleArticles);

//ajouter post avec id

// Route POST pour créer un article
menuItemRoutes.post('/',/*authMiddleware,*/ async (req, res) => {
    try {
        const { name, price, category,description } = req.body;

        // Vérifier que tous les champs sont fournis
        if (!name || !price || !category || !description) {
            return res.status(400).json({ success: false, message: "Veuillez entrer les champs." });
        }
          // Chercher la catégorie par son nom
        const foundCategory = await Categorie.findOne({ name: category });
        if (!foundCategory) {
            return res.status(404).json({ success: false, message: "Catégorie non trouvée !" });
        }

        // Créer et enregistrer l'article
        const article = new Article({ name, price, category, description });
        const savedArticle = await article.save();

        res.status(201).json({ success: true, data: savedArticle });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

menuItemRoutes.get("/",/*authMiddleware,*/ async (req, res) => {
    try {
        const articles = await Article.find();
        res.json({ success: true, data: articles });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});



menuItemRoutes.get("/:id",/*authMiddleware,*/ async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: "Article introuvable !" });

        res.json({ success: true, data: article });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});
menuItemRoutes.put("/:id", /*authMiddleware,*/async (req, res) => {
    try {
        const { name, price, category,description } = req.body;

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id, 
            { name, price, category ,description}, 
            { new: true, runValidators: true } // Retourne l'article mis à jour avec validation
        );

        if (!updatedArticle) return res.status(404).json({ success: false, message: "Article introuvable !" });

        res.json({ success: true, data: updatedArticle });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});
menuItemRoutes.delete("/:id",/* authMiddleware,*/async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        if (!deletedArticle) return res.status(404).json({ success: false, message: "Article introuvable !" });

        res.json({ success: true, message: "Article supprimé avec succès !" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

module.exports=menuItemRoutes;




