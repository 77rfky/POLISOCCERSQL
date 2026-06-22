import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

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

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Pricing Management</h1>
          <p className="text-slate-500 mt-1">Configure pricing categories and rates.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          <FaPlus /> Add Pricing
        </button>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Price / Hour</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pricing.map(p => (
                <tr key={p.id_tarif} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-800">{p.nama_kategori}</td>
                  <td className="py-4 px-6 text-slate-600">{String(p.jam_mulai_berlaku).slice(0, 5)}</td>
                  <td className="py-4 px-6 text-slate-600">{String(p.jam_selesai_berlaku).slice(0, 5)}</td>
                  <td className="py-4 px-6 text-right font-bold text-brand-700">Rp {parseInt(p.harga_per_jam).toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"><FaEdit /></button>
                      <button onClick={() => handleDelete(p.id_tarif)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editItem ? 'Edit Pricing' : 'Add Pricing Tier'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category Name</label>
                <input value={form.nama_kategori} onChange={e => setForm({...form, nama_kategori: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Pagi" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Start Time</label>
                  <input type="time" value={form.jam_mulai_berlaku} onChange={e => setForm({...form, jam_mulai_berlaku: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">End Time</label>
                  <input type="time" value={form.jam_selesai_berlaku} onChange={e => setForm({...form, jam_selesai_berlaku: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Price per Hour (Rp)</label>
                <input type="number" value={form.harga_per_jam} onChange={e => setForm({...form, harga_per_jam: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="150000" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold">
                <FaSave /> Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}