const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM pengguna WHERE role = "User"');
        const [[{ total_bookings }]] = await pool.query('SELECT COUNT(*) as total_bookings FROM booking');
        const [[{ total_revenue }]] = await pool.query('SELECT SUM(total_tagihan) as total_revenue FROM booking WHERE status_booking IN ("Confirmed", "Completed")');

        const [monthly_bookings] = await pool.query(`
            SELECT MONTH(tgl_main) as month, COUNT(*) as count 
            FROM booking 
            GROUP BY MONTH(tgl_main)
        `);

        const [status_distribution] = await pool.query(`
            SELECT status_booking as name, COUNT(*) as value 
            FROM booking 
            GROUP BY status_booking
        `);

        const [popular_field] = await pool.query(`
            SELECT l.nama_lapangan, COUNT(b.id_booking) as total_bookings 
            FROM lapangan l 
            LEFT JOIN booking b ON l.id_lapangan = b.id_lapangan 
            GROUP BY l.id_lapangan 
            ORDER BY total_bookings DESC 
            LIMIT 1
        `);

        res.json({
            total_users,
            total_bookings,
            total_revenue: total_revenue || 0,
            monthly_bookings,
            status_distribution,
            most_popular_field: popular_field.length > 0 ? popular_field[0].nama_lapangan : 'N/A'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
