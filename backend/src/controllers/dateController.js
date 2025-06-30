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

exports.getCurrentDate = async (req, res) => {
    try {
      // Buscar primero una fecha "En juego"
      let current = await Date.findOne({
        where: { status: 'En juego' },
        order: [['number', 'ASC']]
      });
  
      // Si no hay "En juego", buscar la primera "Programada"
      if (!current) {
        current = await Date.findOne({
          where: { status: 'Programada' },
          order: [['number', 'ASC']]
        });
      }
  
      if (!current) {
        return res.status(404).json({ error: 'No hay fechas disponibles con estado válido' });
      }
  
      return res.json({
        id: current.id,
        number: current.number,
        status: current.status,
        date_begin: current.date_begin,
        date_end: current.date_end
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener la fecha actual', details: err.message });
    }
  };
