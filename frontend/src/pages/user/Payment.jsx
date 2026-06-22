import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

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
        const res = await fetch('http://localhost:5001/api/bookings/my-bookings', {
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
      const res = await fetch('http://localhost:5001/api/payments', {
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
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Upload Payment</h1>
        <p className="text-slate-500 mt-1">Submit your transfer proof for verification.</p>
      </motion.div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
        >
          {msg.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{msg.text}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Booking</label>
            <select
              value={selectedBooking}
              onChange={e => setSelectedBooking(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              required
            >
              <option value="">-- Choose Booking --</option>
              {bookings.map(b => (
                <option key={b.id_booking} value={b.id_booking}>
                  {b.id_booking} — Rp {parseInt(b.total_tagihan).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
              <input type="text" placeholder="e.g. BRI, BNI, Mandiri" value={form.bank_asal} onChange={e => setForm({...form, bank_asal: e.target.value})} required
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Holder Name</label>
              <input type="text" placeholder="Name as on transfer" value={form.nama_rekening_pengirim} onChange={e => setForm({...form, nama_rekening_pengirim: e.target.value})} required
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Transfer Proof (Image)</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
              <FaUpload className="text-3xl text-slate-300 mb-3" />
              {file ? (
                <p className="text-green-600 font-semibold">{file.name}</p>
              ) : (
                <p className="text-slate-500">Click to upload or drag and drop (JPG, PNG, max 5MB)</p>
              )}
              <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} className="hidden" />
            </label>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <FaUpload /> {loading ? 'Uploading...' : 'Submit Payment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}