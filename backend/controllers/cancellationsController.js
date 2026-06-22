const pool = require('../config/db');

exports.createCancellation = async (req, res) => {
    try {
        const { id_booking, alasan_batal } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO pembatalan_log (id_booking, alasan_batal) VALUES (?, ?)',
            [id_booking, alasan_batal]
        );

        await pool.query('UPDATE booking SET status_booking = "Cancelled" WHERE id_booking = ?', [id_booking]);

        res.status(201).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCancellations = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, b.tgl_main, u.nama_lengkap
            FROM pembatalan_log c
            JOIN booking b ON c.id_booking = b.id_booking
            JOIN pengguna u ON b.id_pengguna = u.id_pengguna
            ORDER BY c.tgl_batal DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCancellation = async (req, res) => {
    try {
        await pool.query('DELETE FROM pembatalan_log WHERE id_batal = ?', [req.params.id]);
        res.json({ message: 'Cancellation record deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
