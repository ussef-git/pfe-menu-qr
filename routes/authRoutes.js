const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); 
const {login} = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const sendOTPSMS = require("../utils/sendSMS");
const sendOTPEmail = require("../utils/sendEmail")
const authRoutes = express.Router();
// Route de connexion
//Achecker pour les sql injections
authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'admin existe
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Générer un OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Stocker l'OTP temporairement
        admin.otp = otp;
        admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await admin.save();

        // Envoyer l'OTP selon la méthode choisie
        if (admin.verificationMethod === "sms") {
            await sendOTPSMS(admin.telephone, otp);
            return res.json({ message: "OTP envoyé par SMS. Veuillez le saisir pour valider l'authentification." });
        } else if (admin.verificationMethod === "email") {
            await sendOTPEmail(admin.email, otp);
            return res.json({ message: "OTP envoyé par email. Veuillez le saisir pour valider l'authentification." });
        } else {
            return res.status(400).json({ message: "Méthode de vérification inconnue." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
    
});
// Route de vérification de l'OTP
authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'admin existe
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        // Générer un OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Stocker l'OTP temporairement
        admin.otp = otp;
        admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        await admin.save();

        // Envoyer l'OTP selon la méthode choisie
        if (admin.verificationMethod === "sms") {
            await sendOTPSMS(admin.telephone, otp);
            return res.json({ message: "OTP envoyé par SMS. Veuillez le saisir pour valider l'authentification." });
        } else if (admin.verificationMethod === "email") {
            await sendOTPEmail(admin.email, otp);
            return res.json({ message: "OTP envoyé par email. Veuillez le saisir pour valider l'authentification." });
        } else {
            return res.status(400).json({ message: "Méthode de vérification inconnue." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});


// Route d'enregistrement d'un administrateur
authRoutes.post("/register", async (req, res) => {
    try {
        const { email, password, username, telephone, verificationMethod } = req.body;

        // Vérifier si l'admin existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Email déjà utilisé" });

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer un nouvel administrateur
        const newAdmin = new Admin({ email, password: hashedPassword,username,telephone, verificationMethod,authTokens: [] });
        await newAdmin.save();

        // Générer un token JWT
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Administrateur créé avec succès", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
//Test route pour vérifier l'authentification
authRoutes.get("/admin-protected-route", /*authMiddleware,*/ (req, res) => {
    res.json({ message: "Accès autorisé, contenu sécurisé !" });
});
  


module.exports = authRoutes;