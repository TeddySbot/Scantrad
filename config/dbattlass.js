// config/dbattlass.js
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Import des modèles
const User = require('../models/User');
// Importez vos autres modèles ici si nécessaire
// const Project = require('../models/Project');
// const Chapter = require('../models/Chapter');

const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ URI MongoDB manquante dans le fichier .env');
    }

    // Connexion à MongoDB Atlas
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 secondes timeout
    });

    console.log('✅ Connexion à MongoDB Atlas réussie');

    // Liste des collections à vérifier (avec les noms au pluriel, convention MongoDB)
    const collections = [
      { name: 'users', model: User },
      // { name: 'projects', model: Project },
      // { name: 'chapters', model: Chapter },
      // Ajoutez d'autres collections au besoin
    ];

    // Vérification et création si nécessaire des collections
    for (const col of collections) {
      try {
        const exists = await mongoose.connection.db
          .listCollections({ name: col.name })
          .hasNext();

        if (!exists) {
          // Pas besoin de créer explicitement la collection,
          // elle sera créée automatiquement au premier insert
          console.log(`ℹ️ La collection '${col.name}' sera créée automatiquement au premier usage`);
        } else {
          console.log(`✔️ Collection '${col.name}' existe déjà`);
        }
      } catch (err) {
        console.error(`⚠️ Erreur lors de la vérification de la collection ${col.name}:`, err.message);
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB Atlas:', error.message);
    
    // Suggestions de dépannage
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Vérifiez que:');
      console.error('1. Votre URI MongoDB est correcte');
      console.error('2. Votre cluster Atlas est bien démarré');
      console.error('3. Votre IP est autorisée dans les Network Access d\'Atlas');
    }
    
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à la base de données');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté');
});

// Gestion propre de la fermeture
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connexion MongoDB fermée suite à l\'arrêt de l\'application');
  process.exit(0);
});

module.exports = connectToDatabase;