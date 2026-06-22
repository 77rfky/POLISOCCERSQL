const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nama_lengkap, identitas, no_whatsapp, email, password } = req.body;
        
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM pengguna WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO pengguna (nama_lengkap, identitas, no_whatsapp, email, password) VALUES (?, ?, ?, ?, ?)',
            [nama_lengkap, identitas, no_whatsapp, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM pengguna WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = users[0];
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id_pengguna, role: user.role, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id_pengguna,
                nama_lengkap: user.nama_lengkap,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id_pengguna, nama_lengkap, identitas, no_whatsapp, email, role FROM pengguna WHERE id_pengguna = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id_pengguna, nama_lengkap, identitas, no_whatsapp, email, role, created_at FROM pengguna ORDER BY role, nama_lengkap');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Don't allow deleting the super admin
        const [user] = await pool.query('SELECT * FROM pengguna WHERE id_pengguna = ?', [id]);
        if (user.length === 0) return res.status(404).json({ error: 'User not found' });
        if (user[0].email === 'admin@polisoccer.com') return res.status(403).json({ error: 'Cannot delete super admin' });

        await pool.query('DELETE FROM pengguna WHERE id_pengguna = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
