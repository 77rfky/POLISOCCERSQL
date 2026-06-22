const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/availability', bookingsController.getAvailability);
router.post('/', authenticateToken, bookingsController.createBooking);
router.get('/my-bookings', authenticateToken, bookingsController.getUserBookings);

// Admin only
router.get('/', authenticateToken, requireRole('Admin'), bookingsController.getAllBookings);
router.put('/:id/status', authenticateToken, requireRole('Admin'), bookingsController.updateBookingStatus);

module.exports = router;
