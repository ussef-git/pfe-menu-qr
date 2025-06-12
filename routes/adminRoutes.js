const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator'); // Ajout de la validation
const adminRoutes = express.Router();
const { validateAdmin } = require('../middlewares/validation'); // Importer le middleware de validation
const { verify } = require('jsonwebtoken');
const loginLimiter = require('../middlewares/loginLimiter'); // Importer le middleware de limitation de connexion
const jwt=require('jsonwebtoken');
// Créer un nouvel administrateur avec validation et sécurisation
adminRoutes.post('/',authMiddleware,
 validateAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, telephone, verificationMethod } = req.body;

      // Vérifier si l'email ou le téléphone existe déjà
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Un administrateur avec cet email existe déjà." });
      }
      
      // Créer le nouvel admin
      const newAdmin = new Admin({ username, email, password, telephone, verificationMethod });
      await newAdmin.save();

      res.status(201).json({ message: "Administrateur ajouté avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'administrateur.", error: error.message });
    }
  }
);

// Récupérer tous les administrateurs
adminRoutes.get('/',/*authMiddleware,*/ async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Ne pas renvoyer le mot de passe
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des administrateurs.", error: error.message });
  }
});
adminRoutes.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Email incorrect" });
    }

    // Utilise la méthode de comparaison de ton modèle Admin
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '1h' });
    return res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer un administrateur par ID
adminRoutes.get('/:id', /*authMiddleware,*/ async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password'); // Ne pas renvoyer le mot de passe
    if (!admin) return res.status(404).json({ message: "Administrateur introuvable." });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'administrateur.", error: error.message });
  }
});

// Mettre à jour un administrateur avec validation
adminRoutes.put('/:id',/* authMiddleware,*/ async (req, res) => {
  try {
    const { username, email, telephone } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { username, email, telephone },
      { new: true, runValidators: true }
    ).select('-password'); // Ne pas renvoyer le mot de passe

    if (!updatedAdmin) return res.status(404).json({ message: "Administrateur introuvable." });
    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour.", error: error.message });
  }
});

// Supprimer un administrateur
adminRoutes.delete('/:id',/* authMiddleware, */ async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Administrateur introuvable." });
    res.json({ message: "Administrateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error: error.message });
  }
});

module.exports = adminRoutes;