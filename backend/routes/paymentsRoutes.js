const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticateToken, (req, res, next) => {
    upload.single('bukti_transfer')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, paymentsController.uploadPayment);

// Admin only
router.get('/', authenticateToken, requireRole('Admin'), paymentsController.getAllPayments);
router.put('/:id/verify', authenticateToken, requireRole('Admin'), paymentsController.verifyPayment);

module.exports = router;
