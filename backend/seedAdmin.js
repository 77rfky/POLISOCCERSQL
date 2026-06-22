const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        const [existing] = await pool.query('SELECT * FROM pengguna WHERE email = ?', ['admin@polisoccer.com']);
        if (existing.length > 0) {
            console.log('Admin account already exists.');
            // Let's update the password to be sure and set role to Admin
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query('UPDATE pengguna SET password = ?, role = ? WHERE email = ?', [hashedPassword, 'Admin', 'admin@polisoccer.com']);
            console.log('Admin account updated. Email: admin@polisoccer.com, Password: admin123');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO pengguna (nama_lengkap, identitas, no_whatsapp, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                ['Super Admin', '0000000000', '081234567890', 'admin@polisoccer.com', hashedPassword, 'Admin']
            );
            console.log('Admin account created successfully! Email: admin@polisoccer.com, Password: admin123');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        process.exit(0);
    }
}

seed();
