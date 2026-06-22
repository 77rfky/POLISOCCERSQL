import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBan } from 'react-icons/fa';

const mockBookings = [
  { id_booking: 'BK0001', nama_lengkap: 'John Doe', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-20', jam_mulai: '10:00', durasi: 2, total_tagihan: 300000, status_booking: 'Pending Payment' },
  { id_booking: 'BK0002', nama_lengkap: 'Jane Smith', nama_lapangan: 'Lapangan B', tgl_main: '2026-06-21', jam_mulai: '14:00', durasi: 1, total_tagihan: 150000, status_booking: 'Confirmed' },
  { id_booking: 'BK0003', nama_lengkap: 'Bob Wilson', nama_lapangan: 'Lapangan A', tgl_main: '2026-06-22', jam_mulai: '19:00', durasi: 2, total_tagihan: 400000, status_booking: 'Pending Verification' },
];

const statusColor = {
  'Pending Payment': 'bg-yellow-100 text-yellow-700',
  'Pending Verification': 'bg-blue-100 text-blue-700',
  'Confirmed': 'bg-green-100 text-green-700',
  'Completed': 'bg-slate-100 text-slate-600',
  'Cancelled': 'bg-red-100 text-red-600',
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

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Booking Management</h1>
        <p className="text-slate-500 mt-1">View and manage all field bookings.</p>
      </motion.div>

      <div className="mb-6 relative max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search by ID or user..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Field</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(b => (
                <tr key={b.id_booking} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-brand-600">{b.id_booking}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">{b.nama_lengkap}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{b.nama_lapangan}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{b.tgl_main} · {b.jam_mulai}</td>
                  <td className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">Rp {parseInt(b.total_tagihan || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[b.status_booking] || 'bg-slate-100 text-slate-600'}`}>
                      {b.status_booking}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {!['Cancelled', 'Completed'].includes(b.status_booking) && (
                      <button onClick={() => handleCancel(b.id_booking)}
                        className="flex items-center gap-1 mx-auto px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                        <FaBan /> Cancel
                      </button>
                    )}
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