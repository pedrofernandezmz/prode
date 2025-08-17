const User = require('../models/User');

exports.getUserCredits = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    return res.json({
      user_id: user.id,
      username: user.username,
      credits: user.credits
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Error al obtener créditos del usuario',
      details: err.message
    });
  }
};

exports.createUser = async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(400).json({ error: 'Se requieren id y username' });
  }

  try {
    const [user, created] = await User.findOrCreate({
      where: { id },
      defaults: { username }
    });

    if (!created) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        username: user.username,
        credits: user.credits
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Error al crear usuario',
      details: err.message
    });
  }
};

