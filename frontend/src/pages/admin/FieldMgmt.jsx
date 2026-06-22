import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaFutbol } from 'react-icons/fa';
import PremiumInput from '../../components/ui/PremiumInput';

const mockFields = [
  { id_lapangan: 1, nama_lapangan: 'Lapangan A', jenis_rumput: 'Sintetis FIFA', deskripsi: 'Lapangan utama berstandar FIFA.' },
  { id_lapangan: 2, nama_lapangan: 'Lapangan B', jenis_rumput: 'Sintetis Standar', deskripsi: 'Lapangan latihan kapasitas penuh.' },
];

export default function FieldMgmt() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({ nama_lapangan: '', jenis_rumput: '', deskripsi: '' });
  const token = localStorage.getItem('token');

  const fetchFields = async () => {
    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/fields', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFields(data); // Tampilkan array kosong jika tidak ada data di DB
    } catch { 
      setFields(mockFields); // Hanya fallback ke mock jika server mati
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFields(); }, []);

  const openCreate = () => { setEditField(null); setForm({ nama_lapangan: '', jenis_rumput: '', deskripsi: '' }); setShowModal(true); };
  const openEdit = (f) => { setEditField(f); setForm({ nama_lapangan: f.nama_lapangan, jenis_rumput: f.jenis_rumput, deskripsi: f.deskripsi }); setShowModal(true); };

  const handleSave = async () => {
    const url = editField ? `https://polisoccersql-production.up.railway.app/api/fields/${editField.id_lapangan}` : 'https://polisoccersql-production.up.railway.app/api/fields';
    const method = editField ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); fetchFields();
    } catch {
      alert('Failed to save field');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this field?')) return;
    try {
      const res = await fetch(`https://polisoccersql-production.up.railway.app/api/fields/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }
      fetchFields();
    } catch (err) { 
      alert(err.message); 
    }
  };

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Field Management</h1>
          <p className="text-brand-300 font-medium mt-2">Manage all mini soccer facilities.</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all shimmer-button">
          <FaPlus /> Add New Field
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        ) : fields.map((f, idx) => (
          <motion.div 
            key={f.id_lapangan} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring' }}
            whileHover={{ y: -5 }}
            className="glass-premium p-6 rounded-[2rem] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group"
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <FaFutbol />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(f)} className="p-2.5 text-brand-300 hover:text-white hover:bg-brand-500/20 border border-transparent hover:border-brand-500/30 rounded-xl transition-all shadow-sm"><FaEdit /></button>
                <button onClick={() => handleDelete(f.id_lapangan)} className="p-2.5 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-xl transition-all shadow-sm"><FaTrash /></button>
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">{f.nama_lapangan}</h3>
              <span className="inline-block bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4">
                {f.jenis_rumput}
              </span>
              <p className="text-text-secondary text-sm leading-relaxed">{f.deskripsi}</p>
            </div>
          </motion.div>
        ))}
      </div>

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
              className="glass-premium rounded-[2.5rem] p-8 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 overflow-hidden"
            >
              {/* Modal Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-black text-white tracking-tight">{editField ? 'Edit Field' : 'Add New Field'}</h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors border border-white/5"><FaTimes /></button>
              </div>
              
              <div className="space-y-5 relative z-10">
                <PremiumInput 
                  label="Field Name" 
                  value={form.nama_lapangan} 
                  onChange={e => setForm({...form, nama_lapangan: e.target.value})} 
                  placeholder="e.g. Lapangan A" 
                />
                <PremiumInput 
                  label="Grass Type" 
                  value={form.jenis_rumput} 
                  onChange={e => setForm({...form, jenis_rumput: e.target.value})} 
                  placeholder="e.g. Sintetis FIFA" 
                />
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Description</label>
                  <textarea 
                    value={form.deskripsi} 
                    onChange={e => setForm({...form, deskripsi: e.target.value})} 
                    rows={4}
                    className="w-full px-4 py-4 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner resize-none" 
                    placeholder="Field description..." 
                  />
                </div>
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