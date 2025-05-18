// config/config.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ URI MongoDB manquante dans le fichier .env');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connexion à MongoDB Atlas réussie');

    // Création explicite des collections (vide, avec strict: false)
    const emptySchema = new mongoose.Schema({}, { strict: false });

    const collections = [
      { name: 'User', model: mongoose.model('User', emptySchema) },
      { name: 'Project', model: mongoose.model('Project', emptySchema) },
      { name: 'Chapter', model: mongoose.model('Chapter', emptySchema) },
      { name: 'Page', model: mongoose.model('Page', emptySchema) },
      { name: 'Comment', model: mongoose.model('Comment', emptySchema) },
    ];

    for (const col of collections) {
      const exists = await mongoose.connection.db
        .listCollections({ name: col.name.toLowerCase() })
        .hasNext();

      if (!exists) {
        await col.model.createCollection();
        console.log(`🆕 Collection '${col.name}' créée.`);
      } else {
        console.log(`✔️ Collection '${col.name}' déjà existante.`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB Atlas :', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
