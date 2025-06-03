const express = require('express');
const menuRoutes = express.Router();
const Menu = require('../models/menu');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le JWT
function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Token manquant" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token invalide ou expiré" });
        }
        req.user = decoded;
        next();
    });
}

// Route POST pour créer un menu (protégée)
menuRoutes.post('/',/* verifyJWT,*/ async (req, res) => {
    try {
        const { name, categories } = req.body;

        if (!name || !categories || !Array.isArray(categories)) {
            return res.status(400).json({ success: false, message: "Le nom et la liste des catégories sont requis." });
        }

        const newMenu = new Menu({ name, categories });
        const savedMenu = await newMenu.save();

        res.status(201).json({ success: true, data: savedMenu });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route GET pour récupérer tous les menus (protégée)
menuRoutes.get("/", /*verifyJWT,*/ async (req, res) => {
    try {
        // On "populate" pour avoir les infos des catégories
        const menus = await Menu.find().populate('categories');
        res.json({ success: true, data: menus });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

// Route DELETE pour supprimer une catégorie d'un menu (protégée)
menuRoutes.delete("/", /*verifyJWT,*/ async (req, res) => {
    try {
        const { menuId, categorieId } = req.body;

        if (!menuId || !categorieId) {
            return res.status(400).json({ success: false, message: "Veuillez fournir l'ID du menu et l'ID de la catégorie à supprimer." });
        }

        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { $pull: { categories: categorieId } },
            { new: true }
        ).populate('categories');

        if (!updatedMenu) {
            return res.status(404).json({ success: false, message: "Menu non trouvé." });
        }

        res.status(200).json({ success: true, message: `La catégorie a été supprimée du menu.`, data: updatedMenu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
});

module.exports = menuRoutes;