import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaIdCard, FaWhatsapp, FaEnvelope, FaLock, FaSave, FaExclamationCircle, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import PremiumInput from '../../components/ui/PremiumInput';

export default function Profile() {
  const [formData, setFormData] = useState({ nama_lengkap: '', nim_nik: '', no_wa: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const token = localStorage.getItem('token');
  const [userAvatarInitials, setUserAvatarInitials] = useState('US');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({ nama_lengkap: user.nama_lengkap || '', nim_nik: user.nim_nik || '', no_wa: user.no_wa || '', email: user.email || '' });
    if (user.nama_lengkap) {
      const parts = user.nama_lengkap.split(' ');
      const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
      setUserAvatarInitials(initials.toUpperCase());
    }
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...formData }));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      
      const parts = formData.nama_lengkap.split(' ');
      const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
      setUserAvatarInitials(initials.toUpperCase());
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">My Profile</h1>
        <p className="text-brand-300 font-medium mt-2">Manage your personal information and preferences.</p>
      </motion.div>

      <AnimatePresence>
        {msg && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mb-8 p-5 rounded-2xl flex items-center gap-4 shadow-lg border ${
              msg.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
            }`}
          >
            {msg.type === 'success' ? <FaCheckCircle className="text-2xl" /> : <FaExclamationCircle className="text-2xl" />}
            <span className="font-bold tracking-wide">{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Profile Card Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="xl:w-1/3"
        >
          <div className="glass-premium rounded-[2.5rem] p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[40px]"></div>
            
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center text-white text-5xl font-black mb-6 shadow-[0_0_30px_rgba(99,102,241,0.5)] border-4 border-background/50 relative z-10">
              {userAvatarInitials}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-background/50 shadow-sm flex items-center justify-center">
                <FaCheckCircle className="text-white text-sm" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-wide mb-1 relative z-10">{formData.nama_lengkap || 'User'}</h2>
            <p className="text-brand-300 font-medium mb-6 relative z-10">{formData.email}</p>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2 relative z-10"></div>
            
            <div className="w-full flex items-center justify-between py-4 relative z-10">
              <span className="text-text-muted font-medium">Role</span>
              <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-brand-500/30">Member</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="xl:w-2/3"
        >
          <form onSubmit={handleProfileSave}>
            <div className="glass-premium rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
              
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                <FaUserCircle className="text-brand-400" /> Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 relative z-10">
                <PremiumInput 
                  label="Full Name" 
                  value={formData.nama_lengkap} 
                  onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} 
                  placeholder="Your complete name" 
                  required
                />
                <PremiumInput 
                  label="Identity Number (NIM/NIK)" 
                  value={formData.nim_nik} 
                  onChange={e => setFormData({...formData, nim_nik: e.target.value})} 
                  placeholder="National ID / Student ID" 
                />
                <PremiumInput 
                  label="WhatsApp Number" 
                  value={formData.no_wa} 
                  onChange={e => setFormData({...formData, no_wa: e.target.value})} 
                  placeholder="08123456789" 
                  required
                />
                <PremiumInput 
                  label="Email Address" 
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="you@example.com" 
                  required
                />
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex justify-end relative z-10">
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-10 py-4 bg-brand-600 text-white rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(109,40,217,0.6)] hover:bg-brand-500 transition-all disabled:opacity-50 shimmer-button"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FaSave />} 
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}