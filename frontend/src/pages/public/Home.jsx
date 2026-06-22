import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFutbol, FaShower, FaParking, FaWifi, FaChevronRight } from 'react-icons/fa';

export default function Home() {
  const facilities = [
    { icon: <FaFutbol className="w-8 h-8" />, title: 'Rumput Premium', desc: 'Rumput sintetis berstandar FIFA untuk pengalaman bermain maksimal.' },
    { icon: <FaShower className="w-8 h-8" />, title: 'Ruang Ganti', desc: 'Fasilitas ruang ganti dan shower yang bersih dan modern.' },
    { icon: <FaParking className="w-8 h-8" />, title: 'Parkir Gratis', desc: 'Area parkir luas dan aman untuk kenyamanan seluruh pengunjung.' },
    { icon: <FaWifi className="w-8 h-8" />, title: 'Wi-Fi Gratis', desc: 'Akses internet berkecepatan tinggi di sekitar area lapangan.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 bg-slate-900 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-900/40 to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-brand-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-sm mb-6 border border-brand-500/30">
              POLINELA MINI SOCCER
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Tingkatkan Skilmu di <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">POLISOCCER</span>
            </h1>
            <p className="mt-6 text-xl text-slate-300 leading-relaxed max-w-xl">
              Fasilitas mini soccer terbaik di Politeknik Negeri Lampung. Rasakan sensasi rumput premium, fasilitas modern, dan kemudahan booking online.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="bg-gradient-primary text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all hover:-translate-y-1 flex items-center gap-2">
                <span>Pesan Sekarang</span>
                <FaChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="glass-dark text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center">
                Lihat Harga
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square rounded-[3rem] border border-slate-700 bg-gradient-to-br from-brand-900/40 to-slate-800/40 flex items-center justify-center p-4 backdrop-blur-sm shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mini Soccer Field" className="rounded-[2.5rem] w-full h-full object-cover opacity-90" />
               
               {/* Floating Badges */}
               <motion.div 
                 animate={{ y: [0, -15, 0] }} 
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute top-12 -left-8 glass-dark p-4 rounded-2xl flex items-center space-x-4 shadow-xl"
               >
                 <div className="bg-brand-500/20 p-3 rounded-xl">
                   <FaFutbol className="text-brand-400 text-2xl" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 font-medium">Kualitas</p>
                   <p className="font-bold text-white">Standar FIFA</p>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 15, 0] }} 
                 transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                 className="absolute bottom-12 -right-8 glass-dark p-4 rounded-2xl flex items-center space-x-4 shadow-xl"
               >
                 <div className="text-right">
                   <p className="text-xs text-slate-400 font-medium">Buka Setiap Hari</p>
                   <p className="font-bold text-white">08:00 - 22:00</p>
                 </div>
                 <div className="bg-indigo-500/20 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-green-500 animate-pulse"></div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              Fasilitas Jempolan
            </motion.h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Kami menyediakan semua yang Anda butuhkan untuk pertandingan sempurna. Kenyamanan dan kualitas adalah prioritas utama kami.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((fac, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(109,40,217,0.1)] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 text-brand-600 flex items-center justify-center mb-6 shadow-inner">
                  {fac.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{fac.title}</h3>
                <p className="text-slate-600 leading-relaxed">{fac.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary"></div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            Sudah Siap Bermain?
          </motion.h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">Bergabunglah bersama ratusan pemain lain dan nikmati lapangan mini soccer terbaik di Bandar Lampung. Pesan jadwalmu sekarang!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="inline-flex items-center space-x-3 bg-white text-brand-700 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
              <span>Cari Jadwal Kosong</span>
              <FaChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}