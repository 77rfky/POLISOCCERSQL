const pool = require('../config/db');

exports.getAllPricing = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT tk.*, l.nama_lapangan 
            FROM tarif_kategori tk 
            JOIN lapangan l ON tk.id_lapangan = l.id_lapangan
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPricingByField = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tarif_kategori WHERE id_lapangan = ?', [req.params.fieldId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPricing = async (req, res) => {
    try {
        const { id_lapangan, nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam } = req.body;
        const [result] = await pool.query(
            'INSERT INTO tarif_kategori (id_lapangan, nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam) VALUES (?, ?, ?, ?, ?)',
            [id_lapangan, nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam]
        );
        res.status(201).json({ id: result.insertId, message: 'Pricing created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePricing = async (req, res) => {
    try {
        const { nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam } = req.body;
        await pool.query(
            'UPDATE tarif_kategori SET nama_kategori = ?, jam_mulai_berlaku = ?, jam_selesai_berlaku = ?, harga_per_jam = ? WHERE id_tarif = ?',
            [nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam, req.params.id]
        );
        res.json({ message: 'Pricing updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePricing = async (req, res) => {
    try {
        await pool.query('DELETE FROM tarif_kategori WHERE id_tarif = ?', [req.params.id]);
        res.json({ message: 'Pricing deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
