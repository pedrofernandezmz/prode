const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// POST para crear o actualizar pronósticos, se recibe JSON en body
router.post('/', predictionController.createOrUpdatePredictions);

// GET para obtener pronósticos por usuario y fecha (params)
router.get('/:userId/:dateId', predictionController.getPredictionsByUserAndDate);

module.exports = router;
