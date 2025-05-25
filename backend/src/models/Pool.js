// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Pool = sequelize.define('Pool', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   date_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'dates',
//       key: 'id'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE'
//   },
//   credits: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   }
// }, {
//   tableName: 'pools',
//   timestamps: false
// });

// module.exports = Pool;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Jackpot = require('./Jackpot');

const Pool = sequelize.define('pools', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date_id: { type: DataTypes.INTEGER, allowNull: false },
  credits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { timestamps: false });

// Hook para actualizar el jackpot cuando se incrementa credits
Pool.afterUpdate(async (pool, options) => {
  if (pool._previousDataValues.credits < pool.credits) {
    const diff = pool.credits - pool._previousDataValues.credits;
    const [jackpot] = await Jackpot.findOrCreate({ where: { id: 1 }, defaults: { total_credits: 0 } });
    jackpot.total_credits += diff;
    await jackpot.save();
  }
});

module.exports = Pool;

