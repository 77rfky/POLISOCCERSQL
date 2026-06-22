USE db_mini_soccer_polinela;

-- Insert Admin Account (Password: admin123)
INSERT INTO pengguna (nama_lengkap, identitas, no_whatsapp, email, password, role)
VALUES ('Administrator', 'ADMIN001', '081234567890', 'admin@polisoccer.com', '$2b$10$kzo6pz01B6pHlri07PysEezSaVVNjLmZGobx7ji1UPYo7SxVwcpVC', 'Admin');

-- Insert Sample User Account (Password: user123)
INSERT INTO pengguna (nama_lengkap, identitas, no_whatsapp, email, password, role)
VALUES ('Budi Santoso', '21754001', '085678901234', 'budi@example.com', '$2b$10$PrnNL54WTEaPZ4IGpooLK.4Rb1ByDwmrTDXjvHDiDiUi2gx6BjOU6', 'User');

-- Insert 3 Sample Fields
INSERT INTO lapangan (nama_lapangan, jenis_rumput, deskripsi) VALUES
('Lapangan A (Utama)', 'Rumput Sintetis Kualitas A', 'Lapangan utama dengan kualitas rumput sintetis terbaik standar FIFA. Cocok untuk pertandingan resmi atau turnamen.'),
('Lapangan B (Latihan)', 'Rumput Sintetis Kualitas B', 'Lapangan latihan dengan ukuran standar. Cocok untuk bermain bersama teman dan fun match.'),
('Lapangan C (Mini)', 'Rumput Sintetis Kualitas B', 'Lapangan mini untuk permainan 5v5. Cocok untuk latihan ringan.');

-- Insert Pricing Categories
INSERT INTO tarif_kategori (id_lapangan, nama_kategori, jam_mulai_berlaku, jam_selesai_berlaku, harga_per_jam) VALUES
(1, 'Pagi', '08:00:00', '12:00:00', 100000.00),
(1, 'Siang/Sore', '12:00:00', '18:00:00', 150000.00),
(1, 'Malam', '18:00:00', '22:00:00', 200000.00),
(2, 'Pagi', '08:00:00', '12:00:00', 80000.00),
(2, 'Siang/Sore', '12:00:00', '18:00:00', 120000.00),
(2, 'Malam', '18:00:00', '22:00:00', 170000.00),
(3, 'Pagi', '08:00:00', '12:00:00', 70000.00),
(3, 'Siang/Sore', '12:00:00', '18:00:00', 100000.00),
(3, 'Malam', '18:00:00', '22:00:00', 150000.00);

-- Insert Sample Gallery
INSERT INTO konten_galeri (judul_foto, file_gambar) VALUES
('Pertandingan Pembukaan Lapangan A', 'gallery-1.jpg'),
('Fasilitas Ruang Ganti', 'gallery-2.jpg'),
('Latihan Malam Lapangan B', 'gallery-3.jpg');
