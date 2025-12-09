const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// POST /api/v1/log
router.post('/log', logController.createLog);

// Health Check 
router.get('/health', (req, res) => res.send('Log Service OK'));

module.exports = router;