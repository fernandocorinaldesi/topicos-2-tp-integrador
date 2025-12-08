const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/validate', authController.validateApiKey);

router.get('/health', (req, res) => res.send('Auth Service is running OK.'));

module.exports = router;