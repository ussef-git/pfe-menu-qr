const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à la base de données
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
require('dotenv').config();// Charger les variables d’environnement



const app = require("./app");
const http = require("http");


//const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Routes
app.use("/api/db", dbRoutes);
app.use("/api/article",articleRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/qrcode", qrCodeRoutes);
app.use("/api/categories", categoriesRoutes);// Importer les routes de catégories
app.use('/api/admin', adminRoutes);
app.use("/api/menu",menuRoutes);
app.use("/api/login", loginLimiter); // Utiliser le middleware de limitation de connexion
app.use("/api/login", loginLimiterRoutes); // Utiliser les routes de limitation de connexion
app.use("/api/email", emailRoutes); // Utiliser les routes d'email
app.use("/api/sms", smsRoutes); // Utiliser les routes de SMS

// Middleware
app.use(express.json());
app.use(helmet());

// Middleware de gestion des erreurs
app.use(errorHandler);
// console.log("🔗 Tentative de connexion à :", process.env.CONNECTION_STRING);
app.use(express.static("public"));


// Fonction pour démarrer le serveur après connexion à MongoDB
const startServer = async () => {
  try {
    await connectDB();
    // Attendre la connexion avant de lancer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur :", error.message);
    process.exit(1); // Arrêter le processus en cas d'échec critique
  }
};


/*async function testDB() {
  try {
    const admins = await Admin.find();
    console.log("📌 Données récupérées :", admins);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
  }
}

testDB();*/
startServer();