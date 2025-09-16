const axios = require('axios');
const mysql = require('mysql2/promise');

const PREDICTION_OPTIONS = ['L', 'E', 'V'];

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'prode_db'
  });

  const [games] = await connection.execute(
    'SELECT id, id_date FROM games WHERE id_date <= 5'
  );

  // Agrupar por date_id
  const gamesByDate = {};
  games.forEach(game => {
    if (!gamesByDate[game.id_date]) gamesByDate[game.id_date] = [];
    gamesByDate[game.id_date].push(game.id);
  });

  // Cargar predicciones por usuario y fecha
  for (let userId = 1; userId <= 52; userId++) {
    for (const dateId in gamesByDate) {
      const predictions = gamesByDate[dateId].map(game_id => ({
        game_id,
        prediction: PREDICTION_OPTIONS[Math.floor(Math.random() * 3)]
      }));

      try {
        const res = await axios.post('http://localhost:3000/api/predictions', {
          user_id: userId,
          date_id: parseInt(dateId),
          predictions
        });
        console.log(`Sent user_id ${userId}, date_id ${dateId}`);
      } catch (err) {
        console.error(`<<Error>> user_id ${userId}, date_id ${dateId}:`, err.response?.data || err.message);
      }
    }
  }

  await connection.end();
}

main();
