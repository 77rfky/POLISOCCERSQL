import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

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
        setError('Gagal memuat data live. Menampilkan harga standar.');
        setPricing([
          { id_tarif: 1, nama_kategori: 'Sesi Pagi', jam_mulai_berlaku: '08:00', jam_selesai_berlaku: '12:00', harga_per_jam: 100000 },
          { id_tarif: 2, nama_kategori: 'Sesi Siang', jam_mulai_berlaku: '12:00', jam_selesai_berlaku: '18:00', harga_per_jam: 150000 },
          { id_tarif: 3, nama_kategori: 'Sesi Malam', jam_mulai_berlaku: '18:00', jam_selesai_berlaku: '22:00', harga_per_jam: 200000 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen pt-32 pb-16 relative overflow-hidden text-text-primary"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-brand-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-4 rounded-full glass-premium text-brand-300 font-medium text-xs mb-6 uppercase tracking-widest border border-brand-500/20"
          >
            Pilihan Sewa
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
          >
            Daftar <span className="text-gradient">Harga</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-text-muted max-w-2xl mx-auto font-light"
          >
            Harga yang kompetitif dan fleksibel menyesuaikan jadwal luang Anda. Pilih waktu terbaik untuk bermain bersama teman.
          </motion.p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12 glass-premium border border-amber-500/30 text-amber-300 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <FaExclamationTriangle className="text-xl shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((rate, index) => {
              const startTime = rate.jam_mulai_berlaku.slice(0, 5);
              const endTime = rate.jam_selesai_berlaku.slice(0, 5);
              const isPopular = index === 1;

              return (
                <motion.div
                  key={rate.id_tarif}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                  className={`relative rounded-3xl p-1 lg:p-1 transition-all duration-500 group ${
                    isPopular 
                      ? 'bg-gradient-to-b from-brand-400 to-indigo-600 md:-translate-y-4 shadow-[0_0_40px_rgba(139,92,246,0.3)] z-10' 
                      : 'bg-white/5 border border-white/10 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                  }`}
                >
                  <div className={`h-full w-full rounded-[1.4rem] p-8 md:p-10 ${isPopular ? 'bg-background/95 backdrop-blur-xl' : 'glass-premium'}`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-400 to-indigo-400 text-white text-xs font-black px-6 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] tracking-widest uppercase">
                        Paling Laris
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-2 text-white">{rate.nama_kategori}</h3>
                    
                    <div className="flex items-baseline mb-8 mt-6">
                      <span className="text-sm font-bold text-brand-400 mr-2">Rp</span>
                      <span className="text-5xl font-black text-white tracking-tighter">
                        {parseInt(rate.harga_per_jam).toLocaleString('id-ID')}
                      </span>
                      <span className="ml-2 font-medium text-text-muted">/ jam</span>
                    </div>
                    
                    <div className="p-4 rounded-2xl mb-8 flex items-center justify-center font-bold bg-white/5 border border-white/5 text-brand-300">
                      {startTime} - {endTime} WIB
                    </div>

                    <ul className="space-y-5 mb-10">
                      {[
                        'Rumput Sintetis Pilihan',
                        'Ruang Ganti Tersedia',
                        'Parkir Aman & Wi-Fi Gratis',
                        'Fasilitas Lengkap'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-4">
                          <FaCheckCircle className="text-brand-400 shrink-0 text-lg" />
                          <span className="text-text-muted font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/register" className="block mt-auto">
                      <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">
                        Pesan Jadwal Ini
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}