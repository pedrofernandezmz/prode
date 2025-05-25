// const User = require('./User');
// const Game = require('./Game');
// const Prediction = require('./Prediction');
// const Pool = require('./Pool');

// // Asociaciones para que funcione el include
// Prediction.belongsTo(Game, { foreignKey: 'game_id' });
// Game.hasMany(Prediction, { foreignKey: 'game_id' });

// Prediction.belongsTo(User, { foreignKey: 'user_id' });
// User.hasMany(Prediction, { foreignKey: 'user_id' });

// module.exports = {
//   User,
//   Game,
//   Prediction,
//   Pool
// };
const User = require('./User');
const Game = require('./Game');
const Prediction = require('./Prediction');
const Date = require('./Date');
const Pool = require('./Pool');
const Jackpot = require('./Jackpot'); // <--- Asegurate de importar

// Asociaciones
Prediction.belongsTo(Game, { foreignKey: 'game_id' });
Game.hasMany(Prediction, { foreignKey: 'game_id' });

Prediction.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Prediction, { foreignKey: 'user_id' });

Pool.belongsTo(Date, { foreignKey: 'date_id' });

// Exportación si es necesario
module.exports = {
  User,
  Game,
  Prediction,
  Date,
  Pool,
  Jackpot
};
