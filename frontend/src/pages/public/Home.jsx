import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFutbol, FaShower, FaParking, FaWifi, FaChevronRight, FaTimes, FaCheck } from 'react-icons/fa';
import Hero3D from '../../components/ui/Hero3D';
import Button from '../../components/ui/Button';

export default function Home() {
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedFacility(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const facilities = [
    { 
      id: 'rumput',
      icon: <FaFutbol className="w-8 h-8" />, 
      title: 'Rumput Berkualitas', 
      desc: 'Rumput sintetis pilihan untuk memberikan pengalaman bermain yang nyaman.',
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Sintetis Grade A', 'Drainase Cepat Tiris', 'Tidak Licin', 'Aman untuk Tekel']
    },
    { 
      id: 'ruang-ganti',
      icon: <FaShower className="w-8 h-8" />, 
      title: 'Ruang Ganti Bersih', 
      desc: 'Fasilitas ruang ganti dan area bilas yang terawat dengan baik.',
      image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Loker Keamanan', 'Bilik Mandi Privat', 'Wastafel & Kaca Besar', 'Sirkulasi Udara Baik']
    },
    { 
      id: 'parkir',
      icon: <FaParking className="w-8 h-8" />, 
      title: 'Parkir Luas', 
      desc: 'Area parkir kendaraan yang aman dan memadai bagi para pengunjung.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Kapasitas 50+ Mobil', 'Parkir Motor Terpisah', 'CCTV 24 Jam', 'Petugas Keamanan']
    },
    { 
      id: 'wifi',
      icon: <FaWifi className="w-8 h-8" />, 
      title: 'Akses Wi-Fi', 
      desc: 'Koneksi internet gratis untuk menemani waktu istirahat Anda.',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Kecepatan Tinggi', 'Area Tribun', 'Login Sangat Mudah', 'Koneksi Stabil']
    },
  ];

  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName('facility-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Hero Section */}
      <Hero3D />

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[-10%] w-[40rem] h-[40rem] bg-brand-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full glass-premium text-brand-300 font-medium text-xs mb-4 uppercase tracking-widest border border-brand-500/20"
            >
              Fasilitas Memadai
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
            >
              Kenyamanan Bermain Anda
            </motion.h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
              Kami menyediakan sarana dan prasarana lapangan yang bersih dan terawat untuk mendukung aktivitas olahraga Anda bersama teman.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto perspective-1000">
            {facilities.map((fac, idx) => (
              <motion.div 
                layoutId={`card-container-${fac.id}`}
                key={fac.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 }}
                onClick={() => setSelectedFacility(fac)}
                whileHover={{ 
                  scale: 1.02, 
                  rotateX: 2,
                  rotateY: -2,
                  boxShadow: "0 20px 40px rgba(139,92,246,0.15)",
                  borderColor: "rgba(139,92,246,0.5)"
                }}
                style={{ perspective: 1000 }}
                className="facility-card cursor-pointer glass-premium rounded-3xl p-10 group transition-all duration-500 relative overflow-hidden bg-white/[0.02]"
              >
                {/* Spotlight hover effect using CSS variables */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(139,92,246,0.15), transparent 40%)`
                  }}
                />
                
                {/* Subtle base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-indigo-500/0 group-hover:from-brand-500/5 group-hover:to-cyan-500/5 transition-colors duration-500 pointer-events-none"></div>

                <motion.div layoutId={`icon-${fac.id}`} className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 text-brand-400 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300 relative z-10 shadow-[0_0_0_rgba(139,92,246,0)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  {fac.icon}
                </motion.div>
                <motion.h3 layoutId={`title-${fac.id}`} className="text-2xl font-bold mb-4 text-white relative z-10 group-hover:text-brand-300 transition-colors">{fac.title}</motion.h3>
                <motion.p layoutId={`desc-${fac.id}`} className="text-slate-400 leading-relaxed font-light relative z-10">{fac.desc}</motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 to-transparent"></div>
        
        {/* Particle Overlay (CSS simulated) */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-brand-600/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter"
          >
            Siap untuk <span className="text-gradient">Bermain?</span>
          </motion.h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
            Segera atur jadwal bermain Anda bersama teman. Proses pemesanan sangat cepat dan praktis melalui platform kami.
          </p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link to="/register">
              <Button variant="primary" className="!px-10 !py-5 text-lg">
                Cari Jadwal Kosong
                <FaChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Facility Details Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFacility(null)}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-background/60 backdrop-blur-xl"
          >
            <motion.div
              layoutId={`card-container-${selectedFacility.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-[#0B0F19] border border-brand-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] rounded-3xl overflow-hidden flex flex-col md:flex-row relative"
            >
              {/* Image Section */}
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <img src={selectedFacility.image} alt={selectedFacility.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] md:bg-gradient-to-r md:from-transparent md:to-[#0B0F19]"></div>
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-[#0B0F19]/80 backdrop-blur-md">
                <button 
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-brand-500/50 hover:border-brand-500 transition-all z-20 group"
                  aria-label="Tutup"
                >
                  <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <motion.div layoutId={`icon-${selectedFacility.id}`} className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  {selectedFacility.icon}
                </motion.div>

                <motion.h3 layoutId={`title-${selectedFacility.id}`} className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
                  {selectedFacility.title}
                </motion.h3>

                <motion.p layoutId={`desc-${selectedFacility.id}`} className="text-slate-300 font-light leading-relaxed mb-8 text-lg">
                  {selectedFacility.desc}
                </motion.p>

                <div className="space-y-4 mb-10">
                  <h4 className="text-xs font-black tracking-widest text-brand-400 uppercase mb-4 opacity-80">Fitur Unggulan</h4>
                  {selectedFacility.features.map((feat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-4 text-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0">
                        <FaCheck className="w-3 h-3 text-brand-400" />
                      </div>
                      <span className="font-light text-base">{feat}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/register" onClick={() => setSelectedFacility(null)}>
                    <Button variant="primary" className="w-full !py-4 text-lg shimmer-button">
                      Pesan Sekarang
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}