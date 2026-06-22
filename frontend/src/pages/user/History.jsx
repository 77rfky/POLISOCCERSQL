import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFutbol, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa';

const mockHistory = [
  { id_booking: 'BK0001', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-10', jam_mulai: '10:00', durasi: 2, status_booking: 'Completed', total_tagihan: 300000 },
  { id_booking: 'BK0002', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-05', jam_mulai: '19:00', durasi: 1, status_booking: 'Cancelled', total_tagihan: 200000 },
  { id_booking: 'BK0003', nama_lapangan: 'Lapangan A', tgl_main: '2026-05-28', jam_mulai: '14:00', durasi: 2, status_booking: 'Completed', total_tagihan: 300000 },
];

const statusColor = {
  'Pending Payment': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Pending Verification': 'bg-blue-100 text-blue-700 border-blue-200',
  'Confirmed': 'bg-green-100 text-green-700 border-green-200',
  'Completed': 'bg-slate-100 text-slate-600 border-slate-200',
  'Cancelled': 'bg-red-100 text-red-600 border-red-200',
};

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/bookings/my-bookings', {
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

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Booking History</h1>
        <p className="text-slate-500 mt-1">All your past and current bookings in one place.</p>
      </motion.div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <FaFutbol className="text-5xl mb-4 text-slate-200" />
            <p className="font-medium">No bookings found for this filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Field</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(b => (
                <tr key={b.id_booking} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-brand-600">{b.id_booking}</td>
                  <td className="py-4 px-6 text-sm text-slate-700 font-medium">{b.nama_lapangan || 'Lapangan'}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{b.tgl_main} · {b.jam_mulai}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{b.durasi} hr</td>
                  <td className="py-4 px-6 text-sm text-slate-700 font-semibold text-right">Rp {parseInt(b.total_tagihan).toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor[b.status_booking] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {b.status_booking}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}