const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', galleryController.getAllPhotos);

// Admin only
router.post('/', authenticateToken, requireRole('Admin'), upload.single('file_gambar'), galleryController.uploadPhoto);
router.delete('/:id', authenticateToken, requireRole('Admin'), galleryController.deletePhoto);

module.exports = router;
