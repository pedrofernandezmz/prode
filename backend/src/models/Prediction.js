const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prediction = sequelize.define('Prediction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.STRING,  allowNull: false},
  game_id: { type: DataTypes.STRING, allowNull: false },
  prediction: { type: DataTypes.ENUM('L', 'V', 'E'), allowNull: false }
}, {
  tableName: 'predictions',
  timestamps: false
});

module.exports = Prediction;
