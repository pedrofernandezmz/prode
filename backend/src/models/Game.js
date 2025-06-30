const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('games', {
  id: { type: DataTypes.STRING(20), primaryKey: true },
  id_date: { type: DataTypes.INTEGER, allowNull: false },
  team1: { type: DataTypes.STRING(100), allowNull: true },
  team2: { type: DataTypes.STRING(100), allowNull: true },
  score: { type: DataTypes.STRING(10), allowNull: true },
  result: { type: DataTypes.ENUM('L', 'V', 'E'), allowNull: true },
  img1: { type: DataTypes.STRING(255), allowNull: true },
  img2: { type: DataTypes.STRING(255), allowNull: true }
}, {
  timestamps: false
});

module.exports = Game;
