import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBan, FaCalendarAlt, FaClock } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';
import PremiumInput from '../../components/ui/PremiumInput';

const mockBookings = [
  { id_booking: 'BK0001', nama_lengkap: 'John Doe', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-20', jam_mulai: '10:00', durasi: 2, total_tagihan: 300000, status_booking: 'Pending Payment' },
  { id_booking: 'BK0002', nama_lengkap: 'Jane Smith', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-21', jam_mulai: '14:00', durasi: 1, total_tagihan: 150000, status_booking: 'Confirmed' },
  { id_booking: 'BK0003', nama_lengkap: 'Bob Wilson', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-22', jam_mulai: '19:00', durasi: 2, total_tagihan: 400000, status_booking: 'Pending Verification' },
];

const statusStyle = {
  'Pending Payment': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Pending Verification': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Confirmed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Completed': 'bg-white/10 text-text-secondary border-white/5',
  'Cancelled': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function BookingMgmt() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data.length ? data : mockBookings);
    } catch { setBookings(mockBookings); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await fetch(`http://localhost:5001/api/cancellations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_booking: id, alasan_batal: 'Cancelled by admin' })
      });
      fetchBookings();
    } catch {
      setBookings(prev => prev.map(b => b.id_booking === id ? { ...b, status_booking: 'Cancelled' } : b));
    }
  };

  const filtered = bookings.filter(b =>
    b.id_booking?.toLowerCase().includes(search.toLowerCase()) ||
    b.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      header: 'Booking ID', 
      accessor: 'id_booking',
      render: (row) => <span className="font-mono font-bold text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20">{row.id_booking}</span>
    },
    { 
      header: 'User', 
      accessor: 'nama_lengkap',
      render: (row) => <span className="font-bold text-white">{row.nama_lengkap}</span>
    },
    { 
      header: 'Field', 
      accessor: 'nama_lapangan',
      render: (row) => <span className="text-brand-100">{row.nama_lapangan}</span>
    },
    { 
      header: 'Date & Time', 
      accessor: 'datetime',
      render: (row) => (
        <div className="flex flex-col gap-1 text-sm text-text-secondary">
          <span className="flex items-center gap-2"><FaCalendarAlt className="text-brand-400" /> {row.tgl_main}</span>
          <span className="flex items-center gap-2"><FaClock className="text-indigo-400" /> {row.jam_mulai} ({row.durasi} Hour)</span>
        </div>
      )
    },
    { 
      header: 'Total', 
      accessor: 'total_tagihan',
      render: (row) => <span className="font-black text-emerald-400">Rp {parseInt(row.total_tagihan || 0).toLocaleString()}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status_booking',
      render: (row) => (
        <span className={`text-xs font-black px-3 py-1.5 rounded-full border tracking-wide whitespace-nowrap ${statusStyle[row.status_booking] || statusStyle['Completed']}`}>
          {row.status_booking}
        </span>
      )
    },
    { 
      header: 'Action', 
      accessor: 'action',
      render: (row) => !['Cancelled', 'Completed'].includes(row.status_booking) ? (
        <button 
          onClick={(e) => { e.stopPropagation(); handleCancel(row.id_booking); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
        >
          <FaBan /> Cancel
        </button>
      ) : <span className="text-xs text-text-muted px-2">N/A</span>
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Booking Management</h1>
          <p className="text-brand-300 font-medium mt-2">View and manage all field reservations.</p>
        </div>
        <div className="w-full md:w-80">
          <PremiumInput 
            icon={FaSearch}
            placeholder="Search by ID or User..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id_booking}
          emptyMessage="No bookings found matching your search."
        />
      )}
    </div>
  );
}