const pool = require('../config/db');

const generatePaymentCode = async () => {
    const [rows] = await pool.query('SELECT id_pembayaran FROM pembayaran ORDER BY id_pembayaran DESC LIMIT 1');
    if (rows.length === 0) return 'PAY0001';
    
    const lastId = rows[0].id_pembayaran;
    const numberStr = lastId.replace('PAY', '');
    const number = parseInt(numberStr, 10) + 1;
    return `PAY${number.toString().padStart(4, '0')}`;
};

exports.uploadPayment = async (req, res) => {
    try {
        const { id_booking, bank_asal, nama_rekening_pengirim } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Transfer proof image is required' });
        }

        const bukti_transfer = req.file.filename;
        const tgl_transfer = new Date();
        const id_pembayaran = await generatePaymentCode();

        await pool.query(
            'INSERT INTO pembayaran (id_pembayaran, id_booking, bank_asal, nama_rekening_pengirim, bukti_transfer, tgl_transfer, status_verifikasi) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_pembayaran, id_booking, bank_asal, nama_rekening_pengirim, bukti_transfer, tgl_transfer, 'Pending']
        );

        // Update booking status to Pending Verification
        await pool.query('UPDATE booking SET status_booking = "Pending Verification" WHERE id_booking = ?', [id_booking]);

        res.status(201).json({ message: 'Payment uploaded successfully', id_pembayaran });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, b.total_tagihan, u.nama_lengkap as nama_user
            FROM pembayaran p
            JOIN booking b ON p.id_booking = b.id_booking
            JOIN pengguna u ON b.id_pengguna = u.id_pengguna
            ORDER BY p.tgl_transfer DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { status_verifikasi } = req.body;
        const paymentId = req.params.id;
        const adminId = req.user.id;

        // Update payment status
        await pool.query(
            'UPDATE pembayaran SET status_verifikasi = ?, id_admin_verifikator = ? WHERE id_pembayaran = ?',
            [status_verifikasi, adminId, paymentId]
        );

        // Fetch related booking id
        const [payments] = await pool.query('SELECT id_booking FROM pembayaran WHERE id_pembayaran = ?', [paymentId]);
        if (payments.length > 0) {
            const bookingId = payments[0].id_booking;
            
            // Business Rule application
            let newBookingStatus = '';
            if (status_verifikasi === 'Approved') {
                newBookingStatus = 'Confirmed';
            } else if (status_verifikasi === 'Rejected') {
                newBookingStatus = 'Pending Payment'; // Or leave it, logic depends, let's say Pending Payment again so they can reupload
            }

            if (newBookingStatus) {
                await pool.query('UPDATE booking SET status_booking = ? WHERE id_booking = ?', [newBookingStatus, bookingId]);
            }
        }

        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
