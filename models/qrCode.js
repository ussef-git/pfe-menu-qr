const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    url: { 
        type: String, 
        required: true // Lien vers le QR code 
    },
    data: { 
        type: String, 
        required: true // Contenu du QR code
    },
    createdAt: { 
        type: Date, 
        default: Date.now // Date de création automatique
    }
});

// Modèle QR Code sans propriétaire spécifique
const QrCode = mongoose.model('QrCode', qrCodeSchema);

module.exports = QrCode;
/*- Si le QR code est statique → Place l’image directement dans public/ et accède-y via ton backend. ✅
- Si tu veux un QR code dynamique → Génère-le via une API et laisse le frontend l’afficher après la synchronisation. 
*/ 