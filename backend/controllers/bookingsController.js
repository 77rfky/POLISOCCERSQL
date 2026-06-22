const pool = require('../config/db');

// Generate Booking Code logic
const generateBookingCode = async () => {
    const [rows] = await pool.query('SELECT id_booking FROM booking ORDER BY id_booking DESC LIMIT 1');
    if (rows.length === 0) return 'BK0001';
    
    const lastId = rows[0].id_booking;
    const numberStr = lastId.replace('BK', '');
    const number = parseInt(numberStr, 10) + 1;
    return `BK${number.toString().padStart(4, '0')}`;
};

exports.getAvailability = async (req, res) => {
    try {
        const { fieldId, date } = req.query;
        const [bookings] = await pool.query(
            'SELECT jam_mulai, durasi_jam FROM booking WHERE id_lapangan = ? AND tgl_main = ? AND status_booking != "Cancelled"',
            [fieldId, date]
        );
        res.json({ booked_slots: bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { id_lapangan, id_tarif, tgl_main, jam_mulai, durasi_jam, total_tagihan } = req.body;
        
        // Conflict validation (Basic check for exact start time)
        const [conflicts] = await pool.query(
            'SELECT * FROM booking WHERE id_lapangan = ? AND tgl_main = ? AND jam_mulai = ? AND status_booking != "Cancelled"',
            [id_lapangan, tgl_main, jam_mulai]
        );

        if (conflicts.length > 0) {
            return res.status(400).json({ error: 'Time slot is already booked.' });
        }

        const id_booking = await generateBookingCode();
        
        await pool.query(
            'INSERT INTO booking (id_booking, id_pengguna, id_lapangan, id_tarif, tgl_main, jam_mulai, durasi_jam, total_tagihan, status_booking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_booking, req.user.id, id_lapangan, id_tarif, tgl_main, jam_mulai, durasi_jam, total_tagihan, 'Pending Payment']
        );

        res.status(201).json({ message: 'Booking created successfully', id_booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, l.nama_lapangan 
            FROM booking b 
            JOIN lapangan l ON b.id_lapangan = l.id_lapangan 
            WHERE b.id_pengguna = ? 
            ORDER BY b.tgl_dibuat DESC
        `, [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, p.nama_lengkap, l.nama_lapangan 
            FROM booking b 
            JOIN pengguna p ON b.id_pengguna = p.id_pengguna
            JOIN lapangan l ON b.id_lapangan = l.id_lapangan
            ORDER BY b.tgl_dibuat DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status_booking } = req.body;
        await pool.query('UPDATE booking SET status_booking = ? WHERE id_booking = ?', [status_booking, req.params.id]);
        res.json({ message: 'Booking status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
