import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaHistory, FaFutbol } from 'react-icons/fa';

const mockBookings = [
  { id_booking: 'BK0001', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-20', jam_mulai: '10:00', durasi: 2, status_booking: 'Pending Payment', total_tagihan: 300000 },
  { id_booking: 'BK0002', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-21', jam_mulai: '14:00', durasi: 1, status_booking: 'Confirmed', total_tagihan: 150000 },
];

const statusStyle = {
  'Pending Payment': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Pending Verification': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Confirmed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Completed': 'bg-white/10 text-white border-white/20',
  'Cancelled': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
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
    { label: 'Total Pemesanan', value: bookings.length, icon: <FaCalendarAlt className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, color: 'from-brand-600 to-indigo-600', shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]' },
    { label: 'Terkonfirmasi', value: confirmedCount, icon: <FaCheckCircle className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' },
    { label: 'Menunggu Pembayaran', value: pendingCount, icon: <FaClock className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' },
    { label: 'Riwayat Selesai', value: bookings.filter(b => b.status_booking === 'Completed').length, icon: <FaHistory className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, color: 'from-slate-600 to-slate-800', shadow: 'shadow-[0_0_30px_rgba(71,85,105,0.3)]' },
  ];

  return (
    <div className="pb-10">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">{user.nama_lengkap?.split(' ')[0]}!</span>
        </h1>
        <p className="text-brand-300 font-medium mt-2">Here is the summary of your field bookings at POLISOCCER.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${card.color} rounded-[2rem] p-6 text-white ${card.shadow} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-white/80 font-medium text-sm tracking-wide mb-2 uppercase">{card.label}</p>
                <p className="text-5xl font-black tracking-tighter">{card.value}</p>
              </div>
              <div className="opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Bookings */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">Active Bookings</h2>
          <Link to="/user/booking" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all hover:scale-105 shimmer-button">
            + New Booking
          </Link>
        </div>
        
        <div className="glass-premium rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <FaFutbol className="text-5xl text-brand-500/50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active bookings yet.</h3>
              <p className="text-brand-300 mb-8 max-w-sm">You do not have any upcoming matches. Let's schedule one and get back on the field!</p>
              <Link to="/user/booking" className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-black shadow-[0_0_30px_rgba(109,40,217,0.5)] hover:bg-brand-500 transition-all hover:scale-105">Book a Field Now</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {activeBookings.map((booking) => (
                <div key={booking.id_booking} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-white/5 transition-colors gap-6 group relative overflow-hidden">
                  {/* Subtle Hover Glow */}
                  <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(109,40,217,0.4)] group-hover:scale-110 transition-transform duration-500">
                      <FaFutbol className="text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-white mb-1">{booking.nama_lapangan || 'Pemesanan Lapangan'}</p>
                      <p className="text-sm text-brand-300 font-medium">{booking.tgl_main} <span className="mx-2 text-white/30">•</span> {booking.jam_mulai} <span className="mx-2 text-white/30">•</span> {booking.durasi} jam</p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 relative z-10">
                    <span className="font-black text-xl text-emerald-400">Rp {parseInt(booking.total_tagihan).toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black px-4 py-2 rounded-xl border uppercase tracking-wide shadow-sm ${statusStyle[booking.status_booking] || 'bg-white/10 text-white border-white/20'}`}>
                        {statusTranslation[booking.status_booking] || booking.status_booking}
                      </span>
                      <button 
                        onClick={() => handleCancel(booking.id_booking)}
                        className="text-xs text-rose-400 hover:text-white font-bold transition-all px-3 py-2 rounded-xl hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] border border-transparent hover:border-rose-400/50"
                      >
                        Cancel
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