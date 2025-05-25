const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Jackpot = sequelize.define('jackpot', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  total_credits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  timestamps: false
});

module.exports = Jackpot;
