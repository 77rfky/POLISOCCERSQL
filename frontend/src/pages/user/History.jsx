import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFutbol, FaCheckCircle, FaClock, FaBan, FaCalendarAlt } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';

const mockHistory = [
  { id_booking: 'BK0001', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-10', jam_mulai: '10:00', durasi: 2, status_booking: 'Completed', total_tagihan: 300000 },
  { id_booking: 'BK0002', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-05', jam_mulai: '19:00', durasi: 1, status_booking: 'Cancelled', total_tagihan: 200000 },
  { id_booking: 'BK0003', nama_lapangan: 'Lapangan A', tgl_main: '2026-05-28', jam_mulai: '14:00', durasi: 2, status_booking: 'Completed', total_tagihan: 300000 },
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

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://polisoccersql-production.up.railway.app/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setBookings(data.length ? data : mockHistory);
      } catch {
        setBookings(mockHistory);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filters = ['All', 'Confirmed', 'Completed', 'Cancelled', 'Pending Payment'];
  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status_booking === filter);

  const columns = [
    { 
      header: 'Booking ID', 
      accessor: 'id_booking',
      render: (row) => <span className="font-mono font-bold text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20">{row.id_booking}</span>
    },
    { 
      header: 'Field', 
      accessor: 'nama_lapangan',
      render: (row) => <span className="font-bold text-white">{row.nama_lapangan || 'Lapangan'}</span>
    },
    { 
      header: 'Date & Time', 
      accessor: 'datetime',
      render: (row) => (
        <span className="flex items-center gap-2 text-brand-300 font-medium">
          <FaCalendarAlt className="text-brand-400" /> {row.tgl_main} · {row.jam_mulai}
        </span>
      )
    },
    { 
      header: 'Duration', 
      accessor: 'durasi',
      render: (row) => <span className="text-text-secondary">{row.durasi} jam</span>
    },
    { 
      header: 'Total', 
      accessor: 'total_tagihan',
      render: (row) => <span className="font-black text-emerald-400 text-lg">Rp {parseInt(row.total_tagihan).toLocaleString('id-ID')}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status_booking',
      render: (row) => (
        <span className={`text-xs font-black px-4 py-2 rounded-xl border uppercase tracking-wide shadow-sm whitespace-nowrap ${statusStyle[row.status_booking] || 'bg-white/10 text-white border-white/20'}`}>
          {statusTranslation[row.status_booking] || row.status_booking}
        </span>
      )
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Booking History</h1>
        <p className="text-brand-300 font-medium mt-2">View all your past and current bookings.</p>
      </motion.div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              filter === f 
                ? 'bg-brand-600 text-white shadow-[0_0_20px_rgba(109,40,217,0.4)] border border-brand-500 scale-105' 
                : 'glass-premium text-text-secondary hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {f === 'All' ? 'Semua' : statusTranslation[f] || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-premium rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <FaHistory className="text-5xl text-brand-500/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada riwayat.</h3>
            <p className="text-brand-300 max-w-sm">Anda belum memiliki pemesanan dengan status tersebut.</p>
          </div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id_booking}
          emptyMessage="Tidak ada pemesanan ditemukan."
        />
      )}
    </div>
  );
}