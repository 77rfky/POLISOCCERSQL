import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBan, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';

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

  const columns = [
    { 
      header: 'Booking ID', 
      accessor: 'id_booking',
      render: (row) => <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">{row.id_booking}</span>
    },
    { 
      header: 'User', 
      accessor: 'nama_lengkap',
      render: (row) => <span className="font-bold text-white">{row.nama_lengkap}</span>
    },
    { 
      header: 'Match Date', 
      accessor: 'tgl_main',
      render: (row) => (
        <span className="flex items-center gap-2 text-text-secondary">
          <FaCalendarAlt className="text-brand-400" /> {row.tgl_main}
        </span>
      )
    },
    { 
      header: 'Cancelled On', 
      accessor: 'tgl_batal',
      render: (row) => <span className="text-brand-300 font-medium">{new Date(row.tgl_batal).toLocaleDateString('id-ID')}</span>
    },
    { 
      header: 'Reason', 
      accessor: 'alasan_batal',
      render: (row) => (
        <span className="inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold truncate max-w-[200px]" title={row.alasan_batal}>
          {row.alasan_batal}
        </span>
      )
    },
    { 
      header: 'Action', 
      accessor: 'action',
      render: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleDelete(row.id_batal); }}
          className="p-2.5 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-[0_0_10px_rgba(244,63,94,0)] hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] group"
          title="Delete Record"
        >
          <FaTrash className="group-hover:scale-110 transition-transform" />
        </button>
      )
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Cancellation Management</h1>
        <p className="text-brand-300 font-medium mt-2">Review all booking cancellation records and reasons.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={cancellations}
          keyExtractor={(row) => row.id_batal}
          emptyMessage="No cancellation records found."
        />
      )}
    </div>
  );
}