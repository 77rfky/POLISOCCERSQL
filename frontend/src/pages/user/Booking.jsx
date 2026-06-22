import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

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
        const fieldsRes = await fetch('http://localhost:5001/api/fields');
        const fieldsData = await fieldsRes.json();
        setFields(fieldsData);

        const pricingRes = await fetch('http://localhost:5001/api/pricing');
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
        const res = await fetch(`http://localhost:5001/api/bookings/availability?fieldId=${selectedField}&date=${selectedDate}`);
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
      const res = await fetch('http://localhost:5001/api/bookings', {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Pesan Lapangan</h1>
        <p className="text-slate-500 mt-2">Pilih lapangan, tanggal, dan jadwal yang tersedia (hijau). Jadwal berwarna merah berarti sudah dipesan.</p>
      </div>

      {(errorMsg || successMsg) && (
        <div className="mb-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3 font-medium">
              <FaExclamationTriangle /> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 font-medium">
              <FaCheckCircle /> {successMsg}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <form onSubmit={handleBooking} className="space-y-6">
              
              {/* Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Lapangan</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  value={selectedField}
                  onChange={(e) => { setSelectedField(e.target.value); setSelectedTime(''); }}
                  required
                >
                  <option value="">-- Pilih Lapangan --</option>
                  {fields.map(f => <option key={f.id_lapangan} value={f.id_lapangan}>{f.nama_lapangan}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Tanggal</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                    required
                  />
                </div>
              </div>

              {/* Slots */}
              {selectedField && selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jadwal Tersedia {loadingAvailability && <span className="text-xs text-slate-400 font-normal ml-2">Memuat...</span>}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                          slot.isBooked 
                            ? 'bg-red-50 text-red-400 border border-red-100 cursor-not-allowed opacity-60' 
                            : selectedTime === slot.time
                              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-green-100 border border-green-300"></span> Tersedia</div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-red-100 border border-red-300"></span> Dipesan</div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-brand-600"></span> Dipilih</div>
                  </div>
                </motion.div>
              )}

              {/* Duration */}
              {selectedTime && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Durasi (Jam)</label>
                  <div className="flex items-center space-x-6">
                    <input 
                      type="range" 
                      min="1" max="4" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full accent-brand-600"
                    />
                    <span className="font-extrabold text-xl text-brand-600 w-20 text-center">{duration} jam</span>
                  </div>
                  {hasConflict && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                      <FaExclamationTriangle /> Durasi yang dipilih melewati jam operasional atau bertabrakan dengan pemesanan lain.
                    </p>
                  )}
                </motion.div>
              )}

            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl sticky top-24 border border-slate-800">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-brand-400" /> Ringkasan Pemesanan
            </h3>
            
            <div className="space-y-4 text-sm text-slate-300 mb-8">
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span>Lapangan</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {fields.find(f => f.id_lapangan == selectedField)?.nama_lapangan || '-'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span>Tanggal</span>
                <span className="font-semibold text-white">{selectedDate || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span>Jam Mulai</span>
                <span className="font-semibold text-white">{selectedTime || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span>Kategori</span>
                <span className="font-semibold text-brand-400">{currentPricing?.nama_kategori || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <span>Tarif / Jam</span>
                <span className="font-semibold text-white">
                  {currentPricing ? `Rp ${currentPricing.harga_per_jam.toLocaleString('id-ID')}` : '-'}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span>Durasi</span>
                <span className="font-semibold text-white">{duration} jam</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl mb-6 border border-slate-800">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Biaya</p>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-emerald-400 text-2xl" />
                <span className="text-3xl font-extrabold text-white">Rp {totalCost.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={!selectedField || !selectedDate || !selectedTime || hasConflict}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                !selectedField || !selectedDate || !selectedTime || hasConflict
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:shadow-brand-500/40 hover:-translate-y-0.5'
              }`}
            >
              Konfirmasi & Pesan Sekarang
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Status pemesanan akan menjadi <strong>Menunggu Pembayaran</strong> setelah konfirmasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}