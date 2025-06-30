const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

// 📦 Conexión a MySQL
const sequelize = new Sequelize('prode_db', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
});

// 🗃️ Modelos
const Date = sequelize.define('dates', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  number: { type: DataTypes.INTEGER, unique: true },
  status: { type: DataTypes.ENUM('Programada', 'En juego', 'Finalizada'), allowNull: false },
  date_begin: { type: DataTypes.DATE, allowNull: false },
  date_end: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

const Game = sequelize.define('games', {
    id: { type: DataTypes.STRING, primaryKey: true },
    id_date: { type: DataTypes.INTEGER, allowNull: false },
    team1: { type: DataTypes.STRING, allowNull: true },
    team2: { type: DataTypes.STRING, allowNull: true },
    score: { type: DataTypes.STRING, allowNull: true },
    result: { type: DataTypes.ENUM('L', 'V', 'E'), allowNull: true },
    img1: { type: DataTypes.STRING, allowNull: true }, // nuevo
    img2: { type: DataTypes.STRING, allowNull: true }, // nuevo
  }, { timestamps: false });

Game.belongsTo(Date, { foreignKey: 'id_date' });

// 🚀 Función para cargar el JSON
async function loadFixtureFromFile(filePath) {
  const raw = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const data = JSON.parse(raw);
  const stageName = data.games[0]?.stage_round_name;
  const dateNumber = stageName?.match(/\d+/) ? parseInt(stageName.match(/\d+/)[0]) : null;

  if (!dateNumber) throw new Error('No se pudo extraer el número de fecha');

  const games = data.games;
  const statuses = games.map(g => g.status?.enum);

  const allProg = statuses.every(s => s === 1);
  const allFinal = statuses.every(s => s !== 1);
  const status = allProg
    ? 'Programada'
    : allFinal
    ? 'Finalizada'
    : 'En juego';

  const validGames = games.filter(g => g.start_time);
  const startTimes = validGames
    .map(g => dayjs(g.start_time, 'DD-MM-YYYY HH:mm'))
    .sort((a, b) => a.valueOf() - b.valueOf());

  if (startTimes.length === 0) {
    throw new Error('No hay fechas válidas en los partidos');
  }

  const dateBegin = startTimes[0].toDate();
  const dateEnd = startTimes[startTimes.length - 1].add(3, 'hour').toDate();

  // Upsert de fecha
  await Date.upsert({
    id: dateNumber,
    number: dateNumber,
    status,
    date_begin: dateBegin,
    date_end: dateEnd,
  });

  // Upsert de partidos
  for (const g of games) {
    let result = null;
    if (g.winner === 1) result = 'L';
    else if (g.winner === 2) result = 'V';
    else if (g.winner === -1) result = 'E';
  
    const team1 = g.teams?.[0]?.short_name || null;
    const team2 = g.teams?.[1]?.short_name || null;
    const score = (g.scores && g.scores.length === 2)
      ? `${g.scores[0]} - ${g.scores[1]}`
      : null;
    const img1 = g.teams?.[0]?.id || null;
    const img2 = g.teams?.[1]?.id || null;
  
    await Game.upsert({
      id: g.id,
      id_date: dateNumber,
      team1,
      team2,
      score,
      result,
      img1,
      img2,
    });
  }

  console.log(`✅ Fecha ${dateNumber} cargada correctamente`);
}

// 👉 Ejecutar
sequelize.sync().then(async () => {
  try {
    for (let i = 1; i <= 16; i++) {
        await loadFixtureFromFile(`./data/fecha_${i}.json`);
      }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sequelize.close();
  }
});
