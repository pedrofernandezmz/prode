const { User, Game, Prediction, Pool } = require('../models');
const { Op } = require('sequelize');

exports.createOrUpdatePredictions = async (req, res) => {
  const { user_id, date_id, predictions } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar que los partidos correspondan a la fecha enviada
    const gameIds = predictions.map(p => p.game_id);
    const games = await Game.findAll({
      where: {
        id: { [Op.in]: gameIds },
        id_date: date_id
      }
    });

    if (games.length !== predictions.length) {
      return res.status(400).json({ error: 'Algunos partidos no corresponden a la fecha indicada' });
    }

    // Verificar si el usuario ya tiene pronósticos para esta fecha
    const existingPrediction = await Prediction.findOne({
      where: { user_id },
      include: [{
        model: Game,
        where: { id_date: date_id }
      }]
    });

    // Obtener o crear pool para la fecha
    const [pool] = await Pool.findOrCreate({
      where: { date_id },
      defaults: { credits: 0 }
    });

    let creditDeducted = false;
    if (!existingPrediction) {
      if (user.credits < 1) {
        return res.status(400).json({ error: 'Créditos insuficientes para cargar esta fecha' });
      }
      user.credits -= 1;
      await user.save();

      pool.credits += 1;
      await pool.save();

      creditDeducted = true;
    }

    // Actualizar o crear pronósticos
    for (const p of predictions) {
      const [prediction, created] = await Prediction.findOrCreate({
        where: { user_id, game_id: p.game_id },
        defaults: { prediction: p.prediction }
      });
      if (!created) {
        prediction.prediction = p.prediction;
        await prediction.save();
      }
    }

    return res.status(201).json({
      message: 'Pronósticos guardados correctamente',
      creditDeducted,
      remaining_credits: user.credits,
      pool_credits: pool.credits
    });

  } catch (err) {
    return res.status(500).json({ error: 'Error al guardar pronósticos', details: err.message });
  }
};

exports.getPredictionsByUserAndDate = async (req, res) => {
  const { userId, dateId } = req.params;

  try {
    const games = await Game.findAll({ where: { id_date: dateId } });
    const gameIds = games.map(g => g.id);

    const predictions = await Prediction.findAll({
      where: {
        user_id: userId,
        game_id: gameIds
      }
    });

    return res.json({ predictions });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener pronósticos', details: err.message });
  }
};
