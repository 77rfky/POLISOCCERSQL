const express = require('express');
const router = express.Router();
const fieldsController = require('../controllers/fieldsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', fieldsController.getAllFields);
router.get('/:id', fieldsController.getFieldById);

// Admin only routes
router.post('/', authenticateToken, requireRole('Admin'), fieldsController.createField);
router.put('/:id', authenticateToken, requireRole('Admin'), fieldsController.updateField);
router.delete('/:id', authenticateToken, requireRole('Admin'), fieldsController.deleteField);

module.exports = router;
