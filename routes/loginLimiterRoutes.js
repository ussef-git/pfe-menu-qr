const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginLimiter = require("../middlewares/loginLimiter");
const Admin = require("../models/admin");
const loginLimiterRoutes = express.Router();

// Route de connexion
loginLimiterRoutes.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'admin existe
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Générer un token JWT
        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = loginLimiterRoutes;