const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      dbName: "menu_database",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err.message);
    process.exit(1); // Arrête le processus en cas d'échec critique
  }
};

module.exports = connectDB;