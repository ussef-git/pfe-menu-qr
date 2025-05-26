const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

// Récupérer tous les administrateurs
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des administrateurs", error: error.message });
    }
};

// Ajouter un nouvel administrateur avec sécurisation
const addAdmin = async (req, res) => {
    try {
        const { username, email, password, telephone } = req.body;

        // Vérifier si l'email existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Un administrateur avec cet email existe déjà." });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer le nouvel administrateur
        const newAdmin = new Admin({ username, email, password: hashedPassword, telephone });
        await newAdmin.save();

        res.status(201).json({ message: "Administrateur ajouté avec succès", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'administrateur", error: error.message });
    }
};

// Supprimer un administrateur
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ message: "Administrateur non trouvé." });
        }

        res.status(200).json({ message: "Administrateur supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'administrateur", error: error.message });
    }
};

module.exports = { getAllAdmins, addAdmin, deleteAdmin };