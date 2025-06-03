const express = require("express");
const sendOTPEmail = require("../utils/sendEmail.js");

const emailRoutes = express.Router();

emailRoutes.post("/send-email",/*authMiddleware,*/ async (req, res) => {
    const { to, subject, message } = req.body;
    console.log('to:', to, 'subject:', subject, 'message:', message); // Ajoute ce log

    try {
        await sendOTPEmail(to, subject, message); // Correction ici
        res.json({ success: true, message: "Email envoyé avec succès !" });
    } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
}
});
emailRoutes.get("/",async (req, res) => {
    try {
        // Ici, vous pouvez ajouter une logique pour récupérer des données si nécessaire
        res.json({ success: true, message: "Route de test pour l'envoi d'email." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});
module.exports = emailRoutes;