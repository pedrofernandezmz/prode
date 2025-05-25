const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/date/:dateId', gameController.getGamesByDate);

module.exports = router;
