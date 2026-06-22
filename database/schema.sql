CREATE DATABASE IF NOT EXISTS db_mini_soccer_polinela;
USE db_mini_soccer_polinela;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS konten_galeri;
DROP TABLE IF EXISTS pembatalan_log;
DROP TABLE IF EXISTS pembayaran;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS tarif_kategori;
DROP TABLE IF EXISTS lapangan;
DROP TABLE IF EXISTS pengguna;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE pengguna (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    identitas VARCHAR(50) NOT NULL,
    no_whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('User', 'Admin') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lapangan (
    id_lapangan INT AUTO_INCREMENT PRIMARY KEY,
    nama_lapangan VARCHAR(100) NOT NULL,
    jenis_rumput VARCHAR(50) NOT NULL,
    deskripsi TEXT
);

CREATE TABLE tarif_kategori (
    id_tarif INT AUTO_INCREMENT PRIMARY KEY,
    id_lapangan INT NOT NULL,
    nama_kategori VARCHAR(50) NOT NULL,
    jam_mulai_berlaku TIME NOT NULL,
    jam_selesai_berlaku TIME NOT NULL,
    harga_per_jam DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_lapangan) REFERENCES lapangan(id_lapangan) ON DELETE CASCADE
);

CREATE TABLE booking (
    id_booking VARCHAR(20) PRIMARY KEY,
    id_pengguna INT NOT NULL,
    id_lapangan INT NOT NULL,
    id_tarif INT NOT NULL,
    tgl_main DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    durasi_jam INT NOT NULL,
    total_tagihan DECIMAL(10, 2) NOT NULL,
    status_booking ENUM('Pending Payment', 'Pending Verification', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending Payment',
    tgl_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna),
    FOREIGN KEY (id_lapangan) REFERENCES lapangan(id_lapangan),
    FOREIGN KEY (id_tarif) REFERENCES tarif_kategori(id_tarif)
);

CREATE TABLE pembayaran (
    id_pembayaran VARCHAR(20) PRIMARY KEY,
    id_booking VARCHAR(20) NOT NULL,
    bank_asal VARCHAR(50) NOT NULL,
    nama_rekening_pengirim VARCHAR(100) NOT NULL,
    bukti_transfer VARCHAR(255) NOT NULL,
    tgl_transfer DATETIME NOT NULL,
    status_verifikasi ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    id_admin_verifikator INT NULL,
    FOREIGN KEY (id_booking) REFERENCES booking(id_booking) ON DELETE CASCADE,
    FOREIGN KEY (id_admin_verifikator) REFERENCES pengguna(id_pengguna)
);

CREATE TABLE pembatalan_log (
    id_batal INT AUTO_INCREMENT PRIMARY KEY,
    id_booking VARCHAR(20) NOT NULL,
    alasan_batal TEXT NOT NULL,
    tgl_batal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_booking) REFERENCES booking(id_booking) ON DELETE CASCADE
);

CREATE TABLE konten_galeri (
    id_konten INT AUTO_INCREMENT PRIMARY KEY,
    judul_foto VARCHAR(100) NOT NULL,
    tgl_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_gambar VARCHAR(255) NOT NULL
);
