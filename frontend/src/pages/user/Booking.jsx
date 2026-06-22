import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaMoneyBillWave, FaExclamationTriangle, FaFutbol } from 'react-icons/fa';

export default function Booking() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [pricingRates, setPricingRates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Load fields and pricing on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fieldsRes = await fetch('https://polisoccersql-production.up.railway.app/api/fields');
        const fieldsData = await fieldsRes.json();
        setFields(fieldsData);

        const pricingRes = await fetch('https://polisoccersql-production.up.railway.app/api/pricing');
        const pricingData = await pricingRes.json();
        setPricingRates(pricingData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Fetch booked slots when field and date are selected
  useEffect(() => {
    if (!selectedField || !selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const res = await fetch(`https://polisoccersql-production.up.railway.app/api/bookings/availability?fieldId=${selectedField}&date=${selectedDate}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBookedSlots(data.booked_slots || []);
      } catch (err) {
        console.error('Error loading availability:', err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedField, selectedDate]);

  // Generate hourly slots from 08:00 to 22:00
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 8; i < 22; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`;
      
      // Overlapping logic: check if this hour is inside any booking range
      const isBooked = bookedSlots.some(b => {
        const startHour = parseInt(b.jam_mulai.split(':')[0], 10);
        const durationHours = parseInt(b.durasi_jam || 1, 10);
        return i >= startHour && i < (startHour + durationHours);
      });

      slots.push({ time, isBooked });
    }
    return slots;
  }, [bookedSlots]);

  // Check if selected start time + duration overlaps with any booking
  const hasConflict = useMemo(() => {
    if (!selectedTime) return false;
    const startHour = parseInt(selectedTime.split(':')[0], 10);
    
    for (let i = 0; i < duration; i++) {
      const currentHour = startHour + i;
      // Operating hours check (cannot go beyond 22:00)
      if (currentHour >= 22) return true;

      const isBooked = bookedSlots.some(b => {
        const bStart = parseInt(b.jam_mulai.split(':')[0], 10);
        const bDuration = parseInt(b.durasi_jam || 1, 10);
        return currentHour >= bStart && currentHour < (bStart + bDuration);
      });

      if (isBooked) return true;
    }
    return false;
  }, [selectedTime, duration, bookedSlots]);

  // Calculate pricing based on categories and selected time slot
  const currentPricing = useMemo(() => {
    if (!selectedTime) return null;
    const hour = parseInt(selectedTime.split(':')[0], 10);
    return pricingRates.find(rate => {
      const start = parseInt(rate.jam_mulai_berlaku.split(':')[0], 10);
      const end = parseInt(rate.jam_selesai_berlaku.split(':')[0], 10);
      return hour >= start && hour < end;
    });
  }, [selectedTime, pricingRates]);

  const totalCost = currentPricing ? currentPricing.harga_per_jam * duration : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user || !token) {
      // Redirect to login if not authenticated
      alert('Silakan masuk (login) untuk memesan lapangan.');
      navigate('/login');
      return;
    }

    if (!selectedField || !selectedDate || !selectedTime || !duration) {
      setErrorMsg('Harap lengkapi semua bidang.');
      return;
    }

    if (hasConflict) {
      setErrorMsg('Jam atau durasi yang dipilih bertabrakan dengan pemesanan lain.');
      return;
    }

    try {
      const res = await fetch('https://polisoccersql-production.up.railway.app/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_lapangan: selectedField,
          id_tarif: currentPricing.id_tarif,
          tgl_main: selectedDate,
          jam_mulai: selectedTime,
          durasi_jam: duration,
          total_tagihan: totalCost
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pemesanan.');

      setSuccessMsg('Pemesanan berhasil! Mengarahkan ke dasbor...');
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Book a Field</h1>
        <p className="text-brand-300 font-medium mt-2">Select your preferred field, date, and available time slots.</p>
      </motion.div>

      <AnimatePresence>
        {(errorMsg || successMsg) && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mb-8 p-5 rounded-2xl flex items-center gap-4 shadow-lg border ${
              successMsg 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
            }`}
          >
            {successMsg ? <FaCheckCircle className="text-2xl" /> : <FaExclamationTriangle className="text-2xl" />}
            <span className="font-bold tracking-wide">{successMsg || errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-premium rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <form onSubmit={handleBooking} className="space-y-8 relative z-10">
              
              {/* Field & Date Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase">
                    <FaFutbol className="text-brand-400" /> Pilih Lapangan
                  </label>
                  <div className="relative group">
                    <select 
                      className="w-full px-5 py-4 bg-background/50 border border-white/10 rounded-2xl text-white font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 outline-none transition-all appearance-none cursor-pointer group-hover:bg-white/5"
                      value={selectedField}
                      onChange={(e) => { setSelectedField(e.target.value); setSelectedTime(''); }}
                      required
                    >
                      <option value="" className="bg-background text-text-muted">-- Choose Field --</option>
                      {fields.map(f => <option key={f.id_lapangan} value={f.id_lapangan} className="bg-background text-white">{f.nama_lapangan}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-text-muted group-hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase">
                    <FaCalendarAlt className="text-brand-400" /> Pilih Tanggal
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none z-10" />
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-14 pr-5 py-4 bg-background/50 border border-white/10 rounded-2xl text-white font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 outline-none transition-all"
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                      required
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {/* Slots */}
              {selectedField && selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase">
                      <FaClock className="text-brand-400" /> Jadwal Tersedia
                    </label>
                    {loadingAvailability && (
                      <div className="flex items-center gap-2 text-brand-400 text-sm font-medium">
                        <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div> Fetching...
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-3 px-2 rounded-xl text-sm font-black tracking-wide transition-all ${
                          slot.isBooked 
                            ? 'bg-rose-500/10 text-rose-500/50 border border-rose-500/20 cursor-not-allowed' 
                            : selectedTime === slot.time
                              ? 'bg-brand-600 text-white shadow-[0_0_20px_rgba(109,40,217,0.5)] border border-brand-500 scale-105'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-medium"><div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div> Tersedia</div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-medium"><div className="w-4 h-4 rounded-full bg-rose-500/10 border border-rose-500/20"></div> Dipesan</div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-medium"><div className="w-4 h-4 rounded-full bg-brand-600 shadow-[0_0_10px_rgba(109,40,217,0.5)]"></div> Dipilih</div>
                  </div>
                </motion.div>
              )}

              {/* Duration */}
              {selectedTime && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10">
                  <label className="flex items-center gap-2 text-sm font-bold text-text-secondary tracking-wide uppercase mb-6">
                    <FaClock className="text-brand-400" /> Durasi (Jam)
                  </label>
                  <div className="flex items-center space-x-6 bg-background/50 p-6 rounded-2xl border border-white/10">
                    <input 
                      type="range" 
                      min="1" max="4" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                    <span className="font-black text-3xl text-brand-400 w-24 text-center tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{duration} hr</span>
                  </div>
                  {hasConflict && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-sm mt-4 flex items-center gap-2 font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/30">
                      <FaExclamationTriangle className="text-lg" /> Durasi yang dipilih melewati jam operasional atau bertabrakan dengan pemesanan lain.
                    </motion.div>
                  )}
                </motion.div>
              )}

            </form>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="glass-premium rounded-[2.5rem] p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] sticky top-24 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-600/20 to-transparent pointer-events-none"></div>

            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
              <FaCheckCircle className="text-brand-400" /> Ringkasan
            </h3>
            
            <div className="space-y-5 text-sm text-brand-300 font-medium mb-10 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Lapangan</span>
                <span className="font-bold text-white text-base truncate max-w-[150px]">
                  {fields.find(f => f.id_lapangan == selectedField)?.nama_lapangan || '-'}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Tanggal</span>
                <span className="font-bold text-white text-base">{selectedDate || '-'}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Jam Mulai</span>
                <span className="font-bold text-white text-base">{selectedTime || '-'}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Kategori Waktu</span>
                <span className="font-bold text-brand-400 text-base">{currentPricing?.nama_kategori || '-'}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Tarif / Jam</span>
                <span className="font-bold text-white text-base">
                  {currentPricing ? `Rp ${currentPricing.harga_per_jam.toLocaleString('id-ID')}` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-end pb-2">
                <span className="text-text-secondary uppercase tracking-wider text-xs">Durasi</span>
                <span className="font-bold text-white text-base">{duration} jam</span>
              </div>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl mb-8 border border-white/5 relative z-10">
              <p className="text-brand-400 text-xs font-black uppercase tracking-widest mb-2">Total Biaya</p>
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-emerald-400 text-3xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-4xl font-black text-white tracking-tighter">Rp {totalCost.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={!selectedField || !selectedDate || !selectedTime || hasConflict}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex justify-center items-center gap-2 relative z-10 ${
                !selectedField || !selectedDate || !selectedTime || hasConflict
                  ? 'bg-white/5 text-text-muted cursor-not-allowed border border-white/10' 
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_30px_rgba(109,40,217,0.5)] hover:shadow-[0_0_40px_rgba(109,40,217,0.7)] hover:scale-[1.02] shimmer-button'
              }`}
            >
              Confirm Booking
            </button>
            <p className="text-center text-xs text-text-secondary mt-5 relative z-10 font-medium">
              Status pesanan akan menjadi <strong className="text-brand-300">Menunggu Pembayaran</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}