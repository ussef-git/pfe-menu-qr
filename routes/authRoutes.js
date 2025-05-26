const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); 
const {login} = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const authRoutes = express.Router();
// Route de connexion
authRoutes.post("/login", login, async (req, res) => {
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


// Route d'enregistrement d'un administrateur
authRoutes.post("/register", async (req, res) => {
    try {
        const { email, motdepasse } = req.body;

        // Vérifier si l'admin existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Email déjà utilisé" });

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motdepasse, salt);

        // Créer un nouvel administrateur
        const newAdmin = new Admin({ email, motdepasse: hashedPassword });
        await newAdmin.save();

        // Générer un token JWT
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Administrateur créé avec succès", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

authRoutes.get("/admin-protected-route", /*authMiddleware,*/ (req, res) => {
    res.json({ message: "Accès autorisé, contenu sécurisé !" });
});
  


module.exports = authRoutes;