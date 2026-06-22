import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/pricing');
        if (!res.ok) throw new Error('Failed to fetch pricing');
        const data = await res.json();
        
        if (data && data.length > 0) {
          setPricing(data);
        } else {
          throw new Error('No pricing data found');
        }
      } catch (err) {
        console.warn('API Failed, using mock data:', err);
        setError('Gagal memuat data terbaru dari server. Menampilkan tarif standar.');
        setPricing([
          { id_tarif: 1, nama_kategori: 'Pagi', jam_mulai_berlaku: '08:00', jam_selesai_berlaku: '12:00', harga_per_jam: 100000 },
          { id_tarif: 2, nama_kategori: 'Siang/Sore', jam_mulai_berlaku: '12:00', jam_selesai_berlaku: '18:00', harga_per_jam: 150000 },
          { id_tarif: 3, nama_kategori: 'Malam', jam_mulai_berlaku: '18:00', jam_selesai_berlaku: '22:00', harga_per_jam: 200000 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Daftar <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Harga</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Harga transparan dan bersahabat untuk semua kalangan. Pilih waktu yang paling pas dengan jadwalmu.
          </motion.p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <FaExclamationTriangle />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((rate, index) => {
              const startTime = rate.jam_mulai_berlaku.slice(0, 5);
              const endTime = rate.jam_selesai_berlaku.slice(0, 5);
              
              const isPopular = index === 1;

              return (
                <motion.div
                  key={rate.id_tarif}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-3xl p-8 relative shadow-xl transition-all hover:-translate-y-2 ${
                    isPopular 
                      ? 'bg-gradient-to-b from-brand-700 to-indigo-800 text-white transform md:scale-105 z-10' 
                      : 'bg-white border border-slate-100'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      PALING LARIS
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-800'}`}>
                    {rate.nama_kategori}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold">Rp {parseInt(rate.harga_per_jam).toLocaleString('id-ID')}</span>
                    <span className={`ml-2 font-medium ${isPopular ? 'text-brand-200' : 'text-slate-500'}`}>/ jam</span>
                  </div>
                  
                  <div className={`p-4 rounded-xl mb-6 flex items-center justify-center font-semibold ${isPopular ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-700'}`}>
                    {startTime} - {endTime} WIB
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className={isPopular ? 'text-brand-300' : 'text-brand-500'} />
                      <span className={isPopular ? 'text-white/90' : 'text-slate-600'}>Akses rumput premium</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className={isPopular ? 'text-brand-300' : 'text-brand-500'} />
                      <span className={isPopular ? 'text-white/90' : 'text-slate-600'}>Bebas pakai ruang ganti</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className={isPopular ? 'text-brand-300' : 'text-brand-500'} />
                      <span className={isPopular ? 'text-white/90' : 'text-slate-600'}>Parkir & Wi-Fi gratis</span>
                    </li>
                  </ul>

                  <Link 
                    to="/register" 
                    className={`block w-full py-4 text-center rounded-full font-bold transition-all ${
                      isPopular 
                        ? 'bg-white text-brand-700 hover:bg-slate-100 shadow-lg' 
                        : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                    }`}
                  >
                    Pesan Jam Ini
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}