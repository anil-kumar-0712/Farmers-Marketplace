const express = require('express');
const { getCrops, getMyCrops, createCrop, updateCrop, deleteCrop } = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCrops);
router.get('/my', protect, authorize('farmer'), getMyCrops);
router.post('/', protect, authorize('farmer', 'admin'), createCrop);
router.put('/:id', protect, authorize('farmer', 'admin'), updateCrop);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteCrop);

module.exports = router;
