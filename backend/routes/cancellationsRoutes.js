const express = require('express');
const router = express.Router();
const cancellationsController = require('../controllers/cancellationsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/', authenticateToken, cancellationsController.createCancellation);

// Admin only
router.get('/', authenticateToken, requireRole('Admin'), cancellationsController.getAllCancellations);
router.delete('/:id', authenticateToken, requireRole('Admin'), cancellationsController.deleteCancellation);

module.exports = router;
