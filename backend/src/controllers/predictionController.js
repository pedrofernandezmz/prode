const { User, Game, Prediction, Pool, Date } = require('../models');
const { Op, Sequelize } = require('sequelize');

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

exports.getPredictionsWithGamesByUserAndDate = async (req, res) => {
    const { userId, dateId } = req.params;
  
    try {
      // Obtener todos los partidos de la fecha
      const games = await Game.findAll({
        where: { id_date: dateId }
      });
  
      // Obtener predicciones del usuario para esa fecha
      const predictions = await Prediction.findAll({
        where: { user_id: userId },
        include: [{
          model: Game,
          where: { id_date: dateId },
          attributes: []
        }],
        attributes: ['game_id', 'prediction']
      });
  
      // Crear un map para acceder rápido a las predicciones por game_id
      const predictionMap = {};
      predictions.forEach(p => {
        predictionMap[p.game_id] = p.prediction;
      });
  
      // Construir resultado
      const result = games.map(game => ({
        id: game.id,
        team1: game.team1,
        team2: game.team2,
        img1: game.img1,
        img2: game.img2,
        score: game.score,
        result: game.result,
        predicted: predictionMap[game.id] || null
      }));
  
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener predicciones y partidos', details: err.message });
    }
};


exports.getRankingByDateOrTotal = async (req, res) => {
    const { dateNumber } = req.params;
  
    try {
      let whereGames = {};
  
      if (dateNumber !== 'total') {
        const date = await Date.findOne({ where: { number: dateNumber } });
        if (!date) return res.status(404).json({ error: 'Fecha no encontrada' });
        whereGames.id_date = date.id;
      }
  
      const attributes = [
        'user_id',
        [Sequelize.fn('COUNT', Sequelize.col('Prediction.id')), 'aciertos']
      ];
  
      if (dateNumber === 'total') {
        attributes.push([
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT g2.id_date)
            FROM games g2
            INNER JOIN predictions p2 ON p2.game_id = g2.id
            WHERE p2.user_id = Prediction.user_id
          )`),
          'fechas_jugadas'
        ]);
      }
  
      const ranking = await Prediction.findAll({
        attributes,
        where: Sequelize.where(Sequelize.col('Prediction.prediction'), Sequelize.col('game.result')),
        include: [
          {
            model: Game,
            attributes: [],
            where: whereGames
          },
          {
            model: User,
            attributes: ['username']
          }
        ],
        group: ['user_id', 'User.id', 'User.username'],
        order: [[Sequelize.literal('aciertos'), 'DESC']],
        limit: 30,
        raw: true,
        nest: true
      });
      
      // Agregar la posición ordinal #
      const rankingWithPosition = ranking.map((item, index) => ({
        "#": index + 1,
        ...item
      }));
      
      return res.json(rankingWithPosition);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener ranking', details: err.message });
    }
  };

  exports.getUserRankingByDateOrTotal = async (req, res) => {
    const { userId, dateNumber } = req.params;
  
    try {
      let whereGames = {};
      if (dateNumber !== 'total') {
        // Buscar fecha
        const date = await Date.findOne({ where: { number: dateNumber } });
        if (!date) {
          return res.status(404).json({ error: 'Fecha no encontrada' });
        }
        whereGames.id_date = date.id;
      }
  
      // Atributos base
      const attributes = [
        'user_id',
        [Sequelize.fn('COUNT', Sequelize.col('Prediction.id')), 'aciertos']
      ];
  
      if (dateNumber === 'total') {
        // Contar fechas jugadas
        attributes.push([
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT g2.id_date)
            FROM games g2
            INNER JOIN predictions p2 ON p2.game_id = g2.id
            WHERE p2.user_id = Prediction.user_id
          )`),
          'fechas_jugadas'
        ]);
      }
  
      // Obtener ranking completo
      const ranking = await Prediction.findAll({
        attributes,
        where: Sequelize.where(Sequelize.col('Prediction.prediction'), Sequelize.col('game.result')),
        include: [
          {
            model: Game,
            attributes: [],
            where: whereGames
          },
          {
            model: User,
            attributes: ['username']
          }
        ],
        group: ['user_id', 'User.id', 'User.username'],
        order: [[Sequelize.literal('aciertos'), 'DESC']],
        raw: true,
        nest: true
      });
  
      // Buscar el usuario y su posición
      const position = ranking.findIndex(r => r.user_id == userId);
      if (position === -1) {
        return res.status(404).json({ error: 'Usuario no tiene predicciones/aciertos en esta consulta' });
      }
      const userRanking = {
        "#": position + 1,
        ...ranking[position]
      };
  
      return res.json(userRanking);
  
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener ranking de usuario', details: err.message });
    }
  };
  
  