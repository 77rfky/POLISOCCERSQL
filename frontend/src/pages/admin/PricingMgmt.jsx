import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaTags } from 'react-icons/fa';
import GlassTable from '../../components/ui/GlassTable';
import PremiumInput from '../../components/ui/PremiumInput';

const mockPricing = [
  { id_tarif: 1, nama_kategori: 'Pagi', jam_mulai_berlaku: '08:00:00', jam_selesai_berlaku: '12:00:00', harga_per_jam: 100000 },
  { id_tarif: 2, nama_kategori: 'Siang/Sore', jam_mulai_berlaku: '12:00:00', jam_selesai_berlaku: '18:00:00', harga_per_jam: 150000 },
  { id_tarif: 3, nama_kategori: 'Malam', jam_mulai_berlaku: '18:00:00', jam_selesai_berlaku: '22:00:00', harga_per_jam: 200000 },
];

export default function PricingMgmt() {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ nama_kategori: '', jam_mulai_berlaku: '', jam_selesai_berlaku: '', harga_per_jam: '' });
  const token = localStorage.getItem('token');

  const fetchPricing = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/pricing', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPricing(data.length ? data : mockPricing);
    } catch { setPricing(mockPricing); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPricing(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ nama_kategori: '', jam_mulai_berlaku: '', jam_selesai_berlaku: '', harga_per_jam: '' }); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({ nama_kategori: p.nama_kategori, jam_mulai_berlaku: p.jam_mulai_berlaku.slice(0, 5), jam_selesai_berlaku: p.jam_selesai_berlaku.slice(0, 5), harga_per_jam: p.harga_per_jam }); setShowModal(true); };

  const handleSave = async () => {
    const url = editItem ? `http://localhost:5001/api/pricing/${editItem.id_tarif}` : 'http://localhost:5001/api/pricing';
    const method = editItem ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); fetchPricing();
    } catch {
      if (editItem) setPricing(prev => prev.map(p => p.id_tarif === editItem.id_tarif ? { ...p, ...form } : p));
      else setPricing(prev => [...prev, { id_tarif: Date.now(), ...form }]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pricing tier?')) return;
    try {
      await fetch(`http://localhost:5001/api/pricing/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchPricing();
    } catch { setPricing(prev => prev.filter(p => p.id_tarif !== id)); }
  };

  const columns = [
    { 
      header: 'Category', 
      accessor: 'nama_kategori',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <FaTags />
          </div>
          <span className="font-bold text-white text-lg tracking-wide">{row.nama_kategori}</span>
        </div>
      )
    },
    { 
      header: 'Time Period', 
      accessor: 'time',
      render: (row) => (
        <span className="text-brand-300 font-medium">
          {String(row.jam_mulai_berlaku).slice(0, 5)} - {String(row.jam_selesai_berlaku).slice(0, 5)}
        </span>
      )
    },
    { 
      header: 'Price / Hour', 
      accessor: 'harga_per_jam',
      render: (row) => <span className="font-black text-emerald-400 text-lg">Rp {parseInt(row.harga_per_jam).toLocaleString()}</span>
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <div className="flex justify-center gap-3">
          <button onClick={() => openEdit(row)} className="p-2.5 text-brand-300 hover:text-white hover:bg-brand-500/20 border border-transparent hover:border-brand-500/30 rounded-xl transition-all shadow-sm">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row.id_tarif)} className="p-2.5 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-xl transition-all shadow-sm">
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Pricing Management</h1>
          <p className="text-brand-300 font-medium mt-2">Configure time-based pricing categories.</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all shimmer-button">
          <FaPlus /> Add Pricing Tier
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <GlassTable 
          columns={columns}
          data={pricing}
          keyExtractor={(row) => row.id_tarif}
          emptyMessage="No pricing tiers configured."
        />
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-premium rounded-[2.5rem] p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 overflow-hidden"
            >
              {/* Modal Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-black text-white tracking-tight">{editItem ? 'Edit Pricing' : 'Add Pricing Tier'}</h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors border border-white/5"><FaTimes /></button>
              </div>
              
              <div className="space-y-5 relative z-10">
                <PremiumInput 
                  label="Category Name" 
                  value={form.nama_kategori} 
                  onChange={e => setForm({...form, nama_kategori: e.target.value})} 
                  placeholder="e.g. Afternoon Prime" 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <PremiumInput 
                    type="time"
                    label="Start Time" 
                    value={form.jam_mulai_berlaku} 
                    onChange={e => setForm({...form, jam_mulai_berlaku: e.target.value})} 
                  />
                  <PremiumInput 
                    type="time"
                    label="End Time" 
                    value={form.jam_selesai_berlaku} 
                    onChange={e => setForm({...form, jam_selesai_berlaku: e.target.value})} 
                  />
                </div>

                <PremiumInput 
                  type="number"
                  label="Price per Hour (Rp)" 
                  value={form.harga_per_jam} 
                  onChange={e => setForm({...form, harga_per_jam: e.target.value})} 
                  placeholder="150000" 
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-8 relative z-10">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 border border-white/10 text-text-secondary rounded-2xl hover:bg-white/5 hover:text-white font-bold transition-all">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:bg-brand-500 hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all">
                  <FaSave /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}