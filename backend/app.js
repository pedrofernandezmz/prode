const express = require('express');
const app = express();
const sequelize = require('./src/config/db');

// Importar modelos y asociaciones antes de usar la base de datos y rutas
require('./src/models'); // Esto define las asociaciones entre modelos

// Importar rutas
const dateRoutes = require('./src/routes/dateRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const jackpotRoutes = require('./src/routes/jackpotRoutes');

// Middleware para parsear JSON en los request bodies
app.use(express.json());

// Rutas
app.use('/api/dates', dateRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jackpot', jackpotRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Autenticar y sincronizar base de datos antes de arrancar el servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a la base de datos');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a la base de datos:', err);
  });

module.exports = app; // Opcional si usas testing o importas en otro lugar
