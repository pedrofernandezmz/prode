const express = require('express');
const router = express.Router();
const { getUserCredits } = require('../controllers/userController');

router.get('/:userId/credits', getUserCredits);

module.exports = router;
