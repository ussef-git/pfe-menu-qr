const QRCode = require("qrcode");

// Fonction pour générer un QR code
const generateQRCode = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Une URL est requise pour générer un QR code." });
    }

    // Vérification que l'URL est valide
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: "Veuillez fournir une URL valide." });
    }

    // Générer le QR code sous forme d'image encodée en base64
    const qrCodeData = await QRCode.toDataURL(url);

    res.json({ qrCode: qrCodeData });
  } catch (error) {
    console.error("Erreur lors de la génération du QR code :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = { generateQRCode };