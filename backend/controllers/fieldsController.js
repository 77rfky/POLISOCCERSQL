const pool = require('../config/db');

exports.getAllFields = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM lapangan');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFieldById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM lapangan WHERE id_lapangan = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Field not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createField = async (req, res) => {
    try {
        const { nama_lapangan, jenis_rumput, deskripsi } = req.body;
        const [result] = await pool.query('INSERT INTO lapangan (nama_lapangan, jenis_rumput, deskripsi) VALUES (?, ?, ?)', [nama_lapangan, jenis_rumput, deskripsi]);
        res.status(201).json({ id: result.insertId, nama_lapangan, jenis_rumput, deskripsi });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateField = async (req, res) => {
    try {
        const { nama_lapangan, jenis_rumput, deskripsi } = req.body;
        await pool.query('UPDATE lapangan SET nama_lapangan = ?, jenis_rumput = ?, deskripsi = ? WHERE id_lapangan = ?', [nama_lapangan, jenis_rumput, deskripsi, req.params.id]);
        res.json({ message: 'Field updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteField = async (req, res) => {
    try {
        await pool.query('DELETE FROM lapangan WHERE id_lapangan = ?', [req.params.id]);
        res.json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
