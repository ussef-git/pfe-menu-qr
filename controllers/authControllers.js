const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

const login = async (req, res) => {
  const { email, password } = req.body;

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

    // Créer le token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: "✅ Connexion réussie", token });

  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports={ login };