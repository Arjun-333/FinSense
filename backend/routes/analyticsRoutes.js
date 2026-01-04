const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTrends, getInsights } = require('../controllers/analyticsController');

router.get('/trends', protect, getTrends);
router.get('/insights', protect, getInsights);

module.exports = router;
