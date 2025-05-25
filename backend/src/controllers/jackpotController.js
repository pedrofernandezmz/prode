const Jackpot = require('../models/Jackpot');

exports.getJackpot = async (req, res) => {
  try {
    const [jackpot] = await Jackpot.findOrCreate({ where: { id: 1 }, defaults: { total_credits: 0 } });
    return res.json({ total_credits: jackpot.total_credits });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener el jackpot', details: err.message });
  }
};
