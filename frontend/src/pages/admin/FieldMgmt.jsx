import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

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
      const res = await fetch('http://localhost:5001/api/fields', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFields(data.length ? data : mockFields);
    } catch { setFields(mockFields); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFields(); }, []);

  const openCreate = () => { setEditField(null); setForm({ nama_lapangan: '', jenis_rumput: '', deskripsi: '' }); setShowModal(true); };
  const openEdit = (f) => { setEditField(f); setForm({ nama_lapangan: f.nama_lapangan, jenis_rumput: f.jenis_rumput, deskripsi: f.deskripsi }); setShowModal(true); };

  const handleSave = async () => {
    const url = editField ? `http://localhost:5001/api/fields/${editField.id_lapangan}` : 'http://localhost:5001/api/fields';
    const method = editField ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); fetchFields();
    } catch {
      if (editField) setFields(prev => prev.map(f => f.id_lapangan === editField.id_lapangan ? { ...f, ...form } : f));
      else setFields(prev => [...prev, { id_lapangan: Date.now(), ...form }]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this field?')) return;
    try {
      await fetch(`http://localhost:5001/api/fields/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchFields();
    } catch { setFields(prev => prev.filter(f => f.id_lapangan !== id)); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Field Management</h1>
          <p className="text-slate-500 mt-1">Manage all mini soccer fields.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          <FaPlus /> Add Field
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
        ) : fields.map(f => (
          <motion.div key={f.id_lapangan} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-slate-800">{f.nama_lapangan}</h3>
              <div className="flex gap-2">
                <button onClick={() => openEdit(f)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"><FaEdit /></button>
                <button onClick={() => handleDelete(f.id_lapangan)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
              </div>
            </div>
            <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{f.jenis_rumput}</span>
            <p className="text-slate-600 text-sm leading-relaxed">{f.deskripsi}</p>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editField ? 'Edit Field' : 'Add New Field'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Field Name</label>
                <input value={form.nama_lapangan} onChange={e => setForm({...form, nama_lapangan: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Lapangan A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Grass Type</label>
                <input value={form.jenis_rumput} onChange={e => setForm({...form, jenis_rumput: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Sintetis FIFA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={3}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Field description..." />
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