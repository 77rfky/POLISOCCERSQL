const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticateToken, upload.single('bukti_transfer'), paymentsController.uploadPayment);

// Admin only
router.get('/', authenticateToken, requireRole('Admin'), paymentsController.getAllPayments);
router.put('/:id/verify', authenticateToken, requireRole('Admin'), paymentsController.verifyPayment);

module.exports = router;
