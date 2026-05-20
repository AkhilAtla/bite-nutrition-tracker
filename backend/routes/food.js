const express = require('express');
const router = express.Router();
const { getHistory, logFood, searchFood } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/history').get(protect, getHistory);
router.route('/log').post(protect, logFood);
router.route('/search').get(protect, searchFood);

module.exports = router;
