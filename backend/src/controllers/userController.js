const User = require('../models/User');

exports.getUserCredits = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    return res.json({ user_id: user.id, credits: user.credits });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener créditos del usuario', details: err.message });
  }
};
