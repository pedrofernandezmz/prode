const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('games', {
  id: { type: DataTypes.STRING, primaryKey: true },
  id_date: { type: DataTypes.INTEGER, allowNull: false },
  result: { type: DataTypes.ENUM('L', 'V', 'E'), allowNull: true },
}, { timestamps: false });

module.exports = Game;