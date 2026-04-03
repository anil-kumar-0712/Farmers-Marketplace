const express = require('express');
const { predictDemand, getPredictionHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all routes

router.post('/', predictDemand);
router.get('/history', getPredictionHistory);

module.exports = router;
