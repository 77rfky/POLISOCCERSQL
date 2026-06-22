import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaExclamationCircle, FaReceipt, FaImage } from 'react-icons/fa';
import PremiumInput from '../../components/ui/PremiumInput';

const mockBookings = [
  { id_booking: 'BK0001', nama_lapangan: 'Lapangan A', total_tagihan: 300000, status_booking: 'Pending Payment' },
];

export default function Payment() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [form, setForm] = useState({ bank_asal: '', nama_rekening_pengirim: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const res = await fetch('https://polisoccersql-production.up.railway.app/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const pending = data.filter(b => b.status_booking === 'Pending Payment');
        setBookings(pending.length ? pending : mockBookings);
      } catch {
        setBookings(mockBookings);
      }
    };
    fetchPendingBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedBooking) return setMsg({ type: 'error', text: 'Please select a booking and upload transfer proof.' });
    
    setLoading(true);
    setMsg(null);
    const formData = new FormData();
    formData.append('id_booking', selectedBooking);
    formData.append('bank_asal', form.bank_asal);
    formData.append('nama_rekening_pengirim', form.nama_rekening_pengirim);
    formData.append('bukti_transfer', file);

    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/payments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      setMsg({ type: 'success', text: 'Payment proof uploaded! Waiting for admin verification.' });
      setFile(null);
      setForm({ bank_asal: '', nama_rekening_pengirim: '' });
      setSelectedBooking('');
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Upload Payment</h1>
        <p className="text-brand-300 font-medium mt-2">Submit your transfer proof for verification to confirm your booking.</p>
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

      <div className="glass-premium rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] max-w-4xl relative overflow-hidden">
        {/* Ambient Glow inside form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase mb-3">
              <FaReceipt className="text-brand-400" /> Select Booking to Pay
            </label>
            <div className="relative group">
              <select
                value={selectedBooking}
                onChange={e => setSelectedBooking(e.target.value)}
                className="w-full px-5 py-4 bg-background/50 border border-white/10 rounded-2xl text-white font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 outline-none transition-all appearance-none cursor-pointer group-hover:bg-white/5"
                required
              >
                <option value="" className="bg-background text-text-muted">-- Choose Pending Booking --</option>
                {bookings.map(b => (
                  <option key={b.id_booking} value={b.id_booking} className="bg-background text-white">
                    {b.id_booking} — Rp {parseInt(b.total_tagihan).toLocaleString('id-ID')} ({b.nama_lapangan})
                  </option>
                ))}
              </select>
              {/* Custom Select Arrow */}
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-text-muted group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput 
              label="Bank Name" 
              value={form.bank_asal} 
              onChange={e => setForm({...form, bank_asal: e.target.value})} 
              placeholder="e.g. BCA, Mandiri, BNI" 
              required 
            />
            <PremiumInput 
              label="Account Holder Name" 
              value={form.nama_rekening_pengirim} 
              onChange={e => setForm({...form, nama_rekening_pengirim: e.target.value})} 
              placeholder="Name on your bank account" 
              required 
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase mb-3">
              <FaImage className="text-brand-400" /> Transfer Proof Image
            </label>
            <div className="relative group">
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png" 
                onChange={e => setFile(e.target.files[0])} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                required={!file}
              />
              <div className={`w-full p-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${
                file 
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                  : 'border-brand-500/30 bg-background/50 hover:bg-brand-500/10 hover:border-brand-500/60'
              }`}>
                {file ? (
                  <>
                    <FaCheckCircle className="text-5xl text-emerald-400 mb-4 animate-bounce" />
                    <p className="text-emerald-300 font-bold text-lg mb-1">{file.name}</p>
                    <p className="text-emerald-500/70 text-sm">Ready to upload</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                      <FaUpload className="text-3xl text-brand-400" />
                    </div>
                    <p className="text-white font-bold text-lg mb-2">Click to upload or drag and drop</p>
                    <p className="text-text-muted text-sm font-medium">JPG or PNG (max. 5MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/10">
            <button type="submit" disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(109,40,217,0.6)] transition-all disabled:opacity-50 shimmer-button"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FaUpload />} 
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}