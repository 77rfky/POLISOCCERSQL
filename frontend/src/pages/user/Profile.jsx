import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaWhatsapp, FaEnvelope, FaLock, FaSave, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

export default function Profile() {
  const [formData, setFormData] = useState({ nama_lengkap: '', nim_nik: '', no_wa: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({ nama_lengkap: user.nama_lengkap || '', nim_nik: user.nim_nik || '', no_wa: user.no_wa || '', email: user.email || '' });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...formData }));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account information.</p>
      </motion.div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
        >
          {msg.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{msg.text}</span>
        </motion.div>
      )}

      <form onSubmit={handleProfileSave}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Identity Number (NIM/NIK)</label>
              <div className="relative">
                <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={formData.nim_nik} onChange={e => setFormData({...formData, nim_nik: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">WhatsApp Number</label>
              <div className="relative">
                <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={formData.no_wa} onChange={e => setFormData({...formData, no_wa: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}