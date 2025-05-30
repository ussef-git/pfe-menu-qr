const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTPEmail = require('../utils/sendEmail');
const sendOTPSMS = require('../utils/sendSMS'); // À créer si besoin

const login = async (req, res) => {
  const { email, password, verificationMethod } = req.body;

  try {
    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "❌ Email incorrect !" });
    }

    // Vérifier que le rôle est bien ADMIN
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "🚫 Accès refusé ! Seuls les admins peuvent se connecter." });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ Mot de passe incorrect !" });
    }

    // Si la méthode de vérification n'est pas définie, demander à l'utilisateur de choisir
    if (!admin.verificationMethod) {
      if (!verificationMethod) {
        return res.status(200).json({
          message: "Veuillez choisir une méthode de vérification (email ou sms).",
          needVerificationMethod: true
        });
      }
      admin.verificationMethod = verificationMethod;
      await admin.save();
    }

    // Générer un code OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();

    // Envoyer l'OTP selon la méthode choisie
    if (admin.verificationMethod === "email") {
      await sendOTPEmail(admin.email, otp);
    } else if (admin.verificationMethod === "sms") {
      await sendOTPSMS(admin.telephone, otp);
    }

    res.json({
      message: "Un code de vérification a été envoyé.",
      verificationMethod: admin.verificationMethod
    });

  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { login };