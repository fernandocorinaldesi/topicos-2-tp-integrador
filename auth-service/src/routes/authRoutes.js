const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/validate
router.post('/validate', authController.validateApiKey);

// Health check para saber si el servicio vive
router.get('/health', (req, res) => res.send('Auth Service is running OK.'));

module.exports = router;