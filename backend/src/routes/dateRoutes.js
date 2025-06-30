const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

router.get('/', dateController.getAllDates);
router.get('/current', dateController.getCurrentDate);
router.get('/:id', dateController.getDateById);

module.exports = router;
