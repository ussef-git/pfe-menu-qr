const mongoose = require('mongoose');
 const dotenv = require('dotenv');
 const bcrypt = require('bcryptjs');//Pour hacher les mots de passe et assurer la sécurité.
 const Admin = require('./models/admin');
 // Charger les variables d’environnement
 dotenv.config();// Charger les variables d’environnement
 
 // Connexion MongoDB
 mongoose.connect(process.env.CONNECTION_STRING)
   .then(async () => {
     const hash = await bcrypt.hash("admin123", 10);
 
     const newAdmin = new Admin({
       email: "admin@example.com",
       motdepasse: hash,
       telephone:"123456789"
     });
 
     await newAdmin.save();
     console.log("✅ Admin créé avec succès !");
     mongoose.disconnect();
   })
   .catch(err => {
     console.error("❌ Erreur de création d'admin :", err.message);
   }); 