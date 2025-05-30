const express = require('express');
const app = express();
const articleRoutes = require("./routes/articleRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const authRoutes=require("./routes/authRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes"); // Importer les routes de catégories
const adminRoutes = require('./routes/adminRoutes');
const dbRoutes = require('./routes/dbRoutes'); // Importer les routes de la base de données
const menuRoutes = require('./routes/menuRoutes'); // Importer les routes de menu
const helmet = require('helmet'); // Sécuriser les en-têtes HTTP
const errorHandler = require("./middlewares/errorHandler");
const loginLimiter = require("./middlewares/loginLimiter"); // Importer le middleware de limitation de connexion
const loginLimiterRoutes = require("./routes/loginLimiterRoutes"); // Importer les routes de limitation de connexion
const emailRoutes = require("./routes/sendEmailRoutes"); // Importer les routes d'email
const smsRoutes = require("./routes/sendSMSRoutes"); // Importer les routes de SMS
 const cors= require('cors'); // Importer CORS

//Middlewares globbaux
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(helmet());

// Routes
app.use("/api/db", dbRoutes);
app.use("/api/article",articleRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/qrcode", qrCodeRoutes);
app.use("/api/categories", categoriesRoutes);// Importer les routes de catégories
app.use('/api/admin', adminRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/login", loginLimiterRoutes); // Utiliser les routes de limitation de connexion
app.use("/api/email", emailRoutes); // Utiliser les routes d'email
app.use("/api/sms", smsRoutes); // Utiliser les routes de SMS
 


//Middleware de gestion des erreurs
app.use(errorHandler);





module.exports = app; // 🔥 Assure-toi que l'exportation est correcte
