const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');

// POST / (Recibe el JSON del paciente)
router.post('/', predictController.getPrediction);

module.exports = router;