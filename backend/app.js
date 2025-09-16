const express = require('express');
const cors = require('cors'); // <-- importar cors
const app = express();
const sequelize = require('./src/config/db');

require('./src/models'); // Database models

// Import routes
const dateRoutes = require('./src/routes/dateRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jackpotRoutes = require('./src/routes/jackpotRoutes');

// ===== Middleware CORS =====
app.use(cors({
  origin: 'http://localhost:8081', // tu frontend web
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/dates', dateRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jackpot', jackpotRoutes);

// Server Port
const PORT = process.env.PORT || 3000;

// Authenticate and synchronize database before running server
sequelize.authenticate()
  .then(() => {
    console.log('### BACKEND SERVICE STARTED ###\n');
    console.log('### CONNECTED TO DATABASE ###\n');
    app.listen(PORT, () => {
      console.log(`### SERVER RUNNING ON PORT ${PORT} ###`);
    });
  })
  .catch(err => {
    console.error('<<ERROR>> Connecting to database', err);
  });

module.exports = app;
