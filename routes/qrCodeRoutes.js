const express = require("express");
const { generateQRCode } = require("../controllers/qrCodeController");
const qrCodeRoutes = express.Router();
const path = require("path");
const QRCode= require("qrcode"); // Assurez-vous d'avoir installé le package 'qrcode'
const jwt = require("jsonwebtoken");


// QR Code dynamique (change toutes les 5 minutes)
qrCodeRoutes.get("/dynamic", async (req,res) =>{
        // Génère un code unique basé sur la tranche de 5 minutes
   const now =new Date();
   const minutes=Math.floor(now.getTime()/(1000*60*5));
   const dynamicCode=`menu-${minutes}`;
   try {
    const qr = await QRCode.toDataURL(dynamicCode);
    res.json({qr,code:dynamicCode,message:"Scannez-moi pour voir le menu"});
   }catch(err){
   res.status(500).json({message:"Erreur lors de la génération du QR code dynamique",});
   }
});

// QR Code sécurisé avec JWT signé (expire dans 30 minutes)
qrCodeRoutes.get("/secure/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params;
        const payload = {
            type: "menu",
            tableId, // Ajout de l'identifiant de table
            iat: Math.floor(Date.now() / 1000),
        };
        const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });

        // Génère l'URL à encoder dans le QR code
        const url = `https://menu.marestaurant.com/t${tableId}?token=${token}`;
        const qr = await QRCode.toDataURL(url);

        res.json({
            qr,
            url,
            token,
            message: `Scannez-moi pour voir le menu de la table ${tableId}`,
        });
    } catch (err) {
        res.status(500).json({
            message: "Erreur lors de la génération du QR code sécurisé",
        });
    }
});

module.exports = qrCodeRoutes;