const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Date = sequelize.define('dates', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  number: { type: DataTypes.INTEGER, unique: true },
  status: { type: DataTypes.ENUM('Programada', 'En juego', 'Finalizada'), allowNull: false },
  date_begin: { type: DataTypes.DATE, allowNull: false },
  date_end: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

module.exports = Date;
