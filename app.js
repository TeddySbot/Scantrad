const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();


const configureExpress = require('./config/express.config');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const connectToDatabase = require('./config/dbattlass');


connectToDatabase();
configureExpress(app);

app.use(session({
  secret: process.env.SESSION_SECRET || 'votre_secret_tres_securise_ici',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60 // 14 jours
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 jours
  }
}));

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
