import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaWhatsapp, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nim_nik: '',
    no_wa: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          identitas: formData.nim_nik,
          no_whatsapp: formData.no_wa,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      alert('Registration successful! Please sign in.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-text-primary pt-24 pb-16">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-2xl relative z-10 px-4"
      >
        <div className="glass-premium rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(139,92,246,0.1)] border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-brand-300 font-medium tracking-wide">Join POLISOCCER and book your premium field today</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3 relative z-10">
              <FaExclamationCircle className="mt-1 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-secondary tracking-wide">Full Name</label>
              <div className="relative group/input">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />
                <input 
                  type="text" 
                  required
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-secondary tracking-wide">Identity Number (NIM/NIK)</label>
                <div className="relative group/input">
                  <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={formData.nim_nik}
                    onChange={(e) => setFormData({...formData, nim_nik: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-secondary tracking-wide">WhatsApp Number</label>
                <div className="relative group/input">
                  <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={formData.no_wa}
                    onChange={(e) => setFormData({...formData, no_wa: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner"
                    placeholder="081234567890"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-secondary tracking-wide">Email Address</label>
              <div className="relative group/input">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner"
                  placeholder="johndoe@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-secondary tracking-wide">Password</label>
              <div className="relative group/input">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full !py-4 text-lg" disabled={loading}>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Register Account'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-text-muted font-medium relative z-10">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}