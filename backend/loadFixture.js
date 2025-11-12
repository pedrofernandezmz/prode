const { Sequelize, DataTypes } = require('sequelize');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { MongoClient } = require('mongodb');

dayjs.extend(customParseFormat);

// --- Conexión MySQL ---
const sequelize = new Sequelize('prode_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00',
  logging: false,
});

const Date = sequelize.define('Date', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  number: { type: DataTypes.INTEGER, unique: true },
  status: { type: DataTypes.ENUM('Programada', 'En juego', 'Finalizada'), allowNull: false },
  date_begin: { type: DataTypes.DATE, allowNull: false },
  date_end: { type: DataTypes.DATE, allowNull: false },
}, {
  timestamps: false,
  tableName: 'dates',
  freezeTableName: true,
});

const Game = sequelize.define('Game', {
  id: { type: DataTypes.STRING, primaryKey: true },
  id_date: { type: DataTypes.INTEGER, allowNull: false },
  team1: { type: DataTypes.STRING, allowNull: true },
  team2: { type: DataTypes.STRING, allowNull: true },
  score: { type: DataTypes.STRING, allowNull: true },
  result: { type: DataTypes.ENUM('L', 'V', 'E'), allowNull: true },
  img1: { type: DataTypes.STRING, allowNull: true },
  img2: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: false,
  tableName: 'games',
  freezeTableName: true,
});

Game.belongsTo(Date, { foreignKey: 'id_date' });

// --- Conexión MongoDB ---
const mongoUrl = 'mongodb://localhost:27017';
const mongoDbName = 'prode_mongodb';

async function loadAllFixturesFromMongo() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db(mongoDbName);

  for (let i = 1; i <= 16; i++) {
    const collection = db.collection(`fecha_${i}`);
    const docs = await collection.find({}).toArray();

    if (!docs || docs.length === 0) {
      console.log(`<<ERROR>> No data found on fecha_${i} in MongoDB`);
      continue;
    }

    const games = docs.flatMap(d => d.games || []);
    if (games.length === 0) {
      console.log(`<<ERROR>> No match found on fecha_${i}`);
      continue;
    }

    const stageName = games[0]?.stage_round_name;
    const dateNumFromName = stageName?.match(/\d+/) ? parseInt(stageName.match(/\d+/)[0]) : null;
    const actualDateNumber = i || dateNumFromName;

    const statuses = games.map(g => g.status?.enum);
    const allProg = statuses.every(s => s === 1);
    const allFinal = statuses.every(s => s !== 1);
    const status = allProg ? 'Programada' : allFinal ? 'Finalizada' : 'En juego';

    const validGames = games.filter(g => g.start_time);
    const startTimes = validGames
      .map(g => dayjs(g.start_time, 'DD-MM-YYYY HH:mm'))
      .sort((a, b) => a.valueOf() - b.valueOf());

    if (startTimes.length === 0) {
      console.log(`<<ERROR>> No valid matches found on fecha_${i}`);
      continue;
    }

    const dateBegin = startTimes[0].toDate();
    const dateEnd = startTimes[startTimes.length - 1].add(3, 'hour').toDate();

    await Date.upsert({
      id: actualDateNumber,
      number: actualDateNumber,
      status,
      date_begin: dateBegin,
      date_end: dateEnd,
    });

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
        id_date: actualDateNumber,
        team1,
        team2,
        score,
        result,
        img1,
        img2,
      });
    }

    console.log(`DATE ${actualDateNumber} saved/updated in MongoDB`);
  }

  await client.close();
}

// --- Función principal ---
async function runJob() {
  await sequelize.sync();
  try {
    await loadAllFixturesFromMongo();
  } catch (err) {
    console.error('<<Error>>', err.message);
  }
}

// --- Ejecutar inmediatamente y luego cada hora ---
runJob(); // primer ejecución inmediata
setInterval(runJob, 60 * 60 * 1000); // cada hora
