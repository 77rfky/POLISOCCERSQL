const pool = require('../config/db');

exports.getAllPhotos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM konten_galeri ORDER BY tgl_upload DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        const { judul_foto } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const file_gambar = req.file.filename;

        const [result] = await pool.query(
            'INSERT INTO konten_galeri (judul_foto, file_gambar) VALUES (?, ?)',
            [judul_foto, file_gambar]
        );

        res.status(201).json({ id: result.insertId, message: 'Photo uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        await pool.query('DELETE FROM konten_galeri WHERE id_konten = ?', [req.params.id]);
        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
