const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, autoIncrement: false},
  username: DataTypes.STRING,
  credits: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
