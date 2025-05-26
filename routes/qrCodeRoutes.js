const express = require("express");
const { generateQRCode } = require("../controllers/qrCodeController");
const qrCodeRoutes = express.Router();
const path = require("path");


qrCodeRoutes.post("/generate", generateQRCode); // Route pour générer un QR code

/*qrCodeRoutes.get('/', (req, res) => {
    res.send('QR Code API accessible!');
});*/





// Servir l’image statique du QR code
qrCodeRoutes.get("/qrcode", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/qrcode.png"));
});

module.exports = qrCodeRoutes;