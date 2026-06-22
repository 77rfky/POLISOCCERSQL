import { motion } from 'framer-motion';
import { FaTrophy, FaLeaf, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';

export default function About() {
  const values = [
    { icon: <FaTrophy />, title: 'Kualitas Premium', desc: 'Rumput sintetis berkualitas untuk memberikan kenyamanan saat bermain.' },
    { icon: <FaUserFriends />, title: 'Komunitas Nomor Satu', desc: 'Membangun komunitas kampus yang sehat dan aktif melalui olahraga.' },
    { icon: <FaLeaf />, title: 'Ramah Lingkungan', desc: 'Dikelola dengan standar operasional yang ramah lingkungan.' },
    { icon: <FaMapMarkerAlt />, title: 'Lokasi Strategis', desc: 'Sangat mudah diakses, berada tepat di dalam kampus Politeknik Negeri Lampung.' }
  ];

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
        >
          Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">POLISOCCER</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto"
        >
          Destinasi utama bagi para pecinta mini soccer di Politeknik Negeri Lampung. Kami menyediakan fasilitas modern yang lengkap untuk mahasiswa dan masyarakat umum.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Soccer Field" className="w-full h-[400px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h3 className="text-3xl font-bold text-white">Rasakan Pengalaman Terbaik</h3>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Visi Kami</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Menjadi penyedia fasilitas olahraga yang mudah dijangkau dan berkualitas bagi mahasiswa Politeknik Negeri Lampung serta masyarakat di sekitarnya.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Misi Kami</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-lg">
              <li>Menyediakan lapangan mini soccer yang nyaman dan terawat.</li>
              <li>Mempermudah proses pemesanan lapangan melalui sistem online.</li>
              <li>Mendukung kegiatan olahraga positif bagi sivitas akademika dan umum.</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Mengapa Memilih POLISOCCER?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-indigo-100 rounded-xl flex items-center justify-center text-brand-600 text-2xl mb-4 shadow-inner">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{val.title}</h4>
                <p className="text-slate-600">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}