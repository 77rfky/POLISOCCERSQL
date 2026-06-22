import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBan, FaTrash } from 'react-icons/fa';

const mockCancellations = [];

export default function CancellationMgmt() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchCancellations = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/cancellations', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCancellations(data);
    } catch (err) {
      console.error(err);
      setCancellations([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCancellations(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this cancellation record?')) return;
    try {
      await fetch(`http://localhost:5001/api/cancellations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCancellations();
    } catch { setCancellations(prev => prev.filter(c => c.id_batal !== id)); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Cancellation Management</h1>
        <p className="text-slate-500 mt-1">Review all cancellation records and reasons.</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : cancellations.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <FaBan className="text-5xl mb-4 text-slate-200" />
            <p>No cancellations found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Match Date</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cancelled On</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cancellations.map((c, idx) => (
                <tr key={c.id_batal} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-slate-400">{idx + 1}</td>
                  <td className="py-4 px-6 font-mono text-sm font-bold text-red-500">{c.id_booking}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">{c.nama_lengkap}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{c.tgl_main}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{new Date(c.tgl_batal).toLocaleDateString('id-ID')}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 max-w-xs">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">{c.alasan_batal}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDelete(c.id_batal)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FaTrash />
                    </button>
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