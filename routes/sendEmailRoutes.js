const express = require("express");
const sendOTPEmail = require("../utils/sendEmail.js");

const emailRoutes = express.Router();

emailRoutes.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        await sendOTPEmail(to, subject, message); // Correction ici
        res.json({ success: true, message: "Email envoyé avec succès !" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
    }
});

module.exports = emailRoutes;