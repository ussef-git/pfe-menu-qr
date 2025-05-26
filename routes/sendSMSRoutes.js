const express = require("express");
const sendOTPSMS = require("../utils/sendSMS.js");
const smsRoutes = express.Router();

smsRoutes.post("/send-sms", async (req, res) => {
    const { phone, message } = req.body;

    try {
        await sendOTPSMS(phone, message);
        res.json({ success: true, message: "SMS envoyé avec succès !" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi du SMS." });
    }
});

module.exports = smsRoutes;