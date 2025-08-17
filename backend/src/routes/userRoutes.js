const express = require('express');
const router = express.Router();
const { getUserCredits, createUser } = require('../controllers/userController');

router.get('/:userId/credits', getUserCredits);

// Ruta POST para crear usuario
router.post('/', createUser);

module.exports = router;
