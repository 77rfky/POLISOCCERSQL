import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaHistory, FaFutbol } from 'react-icons/fa';

const mockBookings = [
  { id_booking: 'BK0001', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-20', jam_mulai: '10:00', durasi: 2, status_booking: 'Pending Payment', total_tagihan: 300000 },
  { id_booking: 'BK0002', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-21', jam_mulai: '14:00', durasi: 1, status_booking: 'Confirmed', total_tagihan: 150000 },
];

const statusColor = {
  'Pending Payment': 'bg-yellow-100 text-yellow-700',
  'Pending Verification': 'bg-blue-100 text-blue-700',
  'Confirmed': 'bg-green-100 text-green-700',
  'Completed': 'bg-slate-100 text-slate-600',
  'Cancelled': 'bg-red-100 text-red-600',
};

const statusTranslation = {
  'Pending Payment': 'Menunggu Pembayaran',
  'Pending Verification': 'Menunggu Verifikasi',
  'Confirmed': 'Terkonfirmasi',
  'Completed': 'Selesai',
  'Cancelled': 'Dibatalkan',
};

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{"nama_lengkap":"User"}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setBookings(data);
      } catch {
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id_booking) => {
    const alasan = window.prompt("Alasan pembatalan (misal: Hujan, Sakit, dll):");
    if (!alasan) return; // User cancelled the prompt

    try {
      const res = await fetch('http://localhost:5001/api/cancellations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_booking, alasan_batal: alasan })
      });
      
      if (!res.ok) throw new Error('Gagal membatalkan pesanan');
      
      alert('Pesanan berhasil dibatalkan.');
      window.location.reload(); // Refresh to update lists
    } catch (err) {
      alert(err.message);
    }
  };

  const activeBookings = bookings.filter(b => ['Pending Payment', 'Pending Verification', 'Confirmed'].includes(b.status_booking));
  const confirmedCount = bookings.filter(b => b.status_booking === 'Confirmed').length;
  const pendingCount = bookings.filter(b => b.status_booking === 'Pending Payment').length;

  const statCards = [
    { label: 'Total Pemesanan', value: bookings.length, icon: <FaCalendarAlt className="text-3xl" />, color: 'from-brand-600 to-indigo-600' },
    { label: 'Terkonfirmasi', value: confirmedCount, icon: <FaCheckCircle className="text-3xl" />, color: 'from-green-500 to-emerald-600' },
    { label: 'Menunggu Pembayaran', value: pendingCount, icon: <FaClock className="text-3xl" />, color: 'from-amber-500 to-orange-600' },
    { label: 'Riwayat', value: bookings.filter(b => b.status_booking === 'Completed').length, icon: <FaHistory className="text-3xl" />, color: 'from-slate-500 to-slate-700' },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Selamat datang kembali, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{user.nama_lengkap?.split(' ')[0]}!</span>
        </h1>
        <p className="text-slate-500 mt-1">Berikut ringkasan pemesanan lapangan Anda di POLISOCCER.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">{card.label}</p>
                <p className="text-4xl font-extrabold mt-1">{card.value}</p>
              </div>
              <div className="opacity-30">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Bookings */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Pemesanan Aktif</h2>
          <Link to="/user/booking" className="text-sm text-brand-600 font-semibold hover:underline">+ Pesan Lapangan Baru</Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <FaFutbol className="text-5xl mb-4 text-slate-200" />
              <p className="font-medium">Belum ada pemesanan aktif.</p>
              <Link to="/user/booking" className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-full text-sm font-bold hover:bg-brand-700 transition-colors">Pesan Sekarang</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {activeBookings.map((booking) => (
                <div key={booking.id_booking} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                      <FaFutbol />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{booking.nama_lapangan || 'Pemesanan Lapangan'}</p>
                      <p className="text-sm text-slate-500">{booking.tgl_main} · {booking.jam_mulai} · {booking.durasi} jam</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">Rp {parseInt(booking.total_tagihan).toLocaleString('id-ID')}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[booking.status_booking] || 'bg-slate-100 text-slate-600'}`}>
                        {statusTranslation[booking.status_booking] || booking.status_booking}
                      </span>
                      <button 
                        onClick={() => handleCancel(booking.id_booking)}
                        className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors px-2"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}