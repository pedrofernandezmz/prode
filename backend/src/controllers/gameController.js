const Game = require('../models/Game');

exports.getGamesByDate = async (req, res) => {
  try {
    const games = await Game.findAll({
      where: { id_date: req.params.dateId },
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
};
