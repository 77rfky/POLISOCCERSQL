const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', galleryController.getAllPhotos);

// Admin only
router.post('/', authenticateToken, requireRole('Admin'), (req, res, next) => {
    upload.single('file_gambar')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, galleryController.uploadPhoto);
router.delete('/:id', authenticateToken, requireRole('Admin'), galleryController.deletePhoto);

module.exports = router;
