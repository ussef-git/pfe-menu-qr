const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator'); // Ajout de la validation
const adminRoutes = express.Router();

// Créer un nouvel administrateur avec validation et sécurisation
adminRoutes.post(
  '/',
 validateAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, telephone } = req.body;

      // Vérifier si l'email ou le téléphone existe déjà
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Un administrateur avec cet email existe déjà." });
      }

      // Hacher le mot de passe avant de sauvegarder
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer le nouvel admin
      const newAdmin = new Admin({ username, email, password: hashedPassword, telephone });
      await newAdmin.save();

      res.status(201).json({ message: "Administrateur ajouté avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'administrateur.", error: error.message });
    }
  }
);

// Récupérer tous les administrateurs
adminRoutes.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Ne pas renvoyer le mot de passe
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des administrateurs.", error: error.message });
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