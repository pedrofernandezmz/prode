const express = require('express');
const router = express.Router();
const { getJackpot } = require('../controllers/jackpotController');

router.get('/', getJackpot);

module.exports = router;
