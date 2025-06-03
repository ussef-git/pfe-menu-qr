const express = require("express");
const sendOTPSMS = require("../utils/sendSMS.js");
const smsRoutes = express.Router();

smsRoutes.post("/send-sms",/*authMiddleware,*/ async (req, res) => {
    const { telephone, otp } = req.body;

    try {
        await sendOTPSMS(telephone, otp);
        res.json({ success: true, message: "SMS envoyé avec succès !" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi du SMS." });
    }
});

module.exports = smsRoutes;