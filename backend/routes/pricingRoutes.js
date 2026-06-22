const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', pricingController.getAllPricing);
router.get('/field/:fieldId', pricingController.getPricingByField);

router.post('/', authenticateToken, requireRole('Admin'), pricingController.createPricing);
router.put('/:id', authenticateToken, requireRole('Admin'), pricingController.updatePricing);
router.delete('/:id', authenticateToken, requireRole('Admin'), pricingController.deletePricing);

module.exports = router;
