const Date = require('../models/Date');

exports.getAllDates = async (req, res) => {
  try {
    const dates = await Date.findAll();
    res.json(dates);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fechas' });
  }
};

exports.getDateById = async (req, res) => {
  try {
    const date = await Date.findByPk(req.params.id);
    if (!date) return res.status(404).json({ error: 'Fecha no encontrada' });
    res.json(date);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la fecha' });
  }
};
