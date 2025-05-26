const express = require('express');
const app = express();
const categorieRoutes = require('./routes/categoriesRoutes'); // Importer les routes de catégories
const adminRoutes = require('./routes/adminRoutes'); // Importer les routes d'administration
const articleRoutes = require('./routes/articleRoutes'); // Importer les routes d'articles
const authRoutes = require('./routes/authRoutes'); // Importer les routes d'authentification
const qrCodeRoutes = require('./routes/qrCodeRoutes'); // Importer les routes de QR code
const menuRoutes = require('./routes/menuRoutes'); // Importer les routes de menu
const dbRoutes = require('./routes/dbRoutes'); // Importer les routes de la base de données 
const loginLimiter = require("./middlewares/loginLimiter");
const api="/api"; // Définir le préfixe de l'API


app.use(express.json()); // Middleware pour parser le JSON
app.use(`${api}/login`, loginLimiter);
app.use(`${api}/db`, dbRoutes); // Utiliser les routes de la base de données
app.use(`${api}/categories`,categorieRoutes); // Utiliser les routes de catégories
app.use(`${api}/admin`,adminRoutes);
app.use(`${api}/article`,articleRoutes);
app.use(`${api}/auth`,authRoutes); // Utiliser les routes d'authentification
app.use(`${api}/qrcode`, qrCodeRoutes); // Utiliser les routes de QR code
app.use(`${api}/menu`, menuRoutes); // Utiliser les routes de menu

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("🚨 Erreur détectée :", err.message);
  res.status(500).json({ message: "Erreur interne du serveur" });
   next(err);
});



module.exports = app; // 🔥 Assure-toi que l'exportation est correcte
