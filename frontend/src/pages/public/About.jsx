import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { FaTrophy, FaLeaf, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

const revealVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } }
};

const timelineData = [
  { year: '2023', title: 'Awal Mula', desc: 'Perumusan konsep dan perencanaan awal untuk menghadirkan fasilitas olahraga di area kampus.' },
  { year: '2024', title: 'Mulai Pembangunan', desc: 'Proses pembangunan lapangan dan fasilitas pendukung lainnya mulai berjalan.' },
  { year: '2025', title: 'Pembukaan Resmi', desc: 'Peluncuran POLISOCCER untuk umum, menyambut antusiasme mahasiswa dan masyarakat.' },
  { year: '2026', title: 'Kemudahan Digital', desc: 'Hadirnya sistem pemesanan online untuk memudahkan Anda dalam mengecek jadwal dan menyewa lapangan.' }
];

function AnimatedTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 50, damping: 15 });
  const beamPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const parallaxX = useSpring(useTransform(mouseX, [-1000, 1000], [-20, 20]), { stiffness: 50, damping: 20 });
  const parallaxY = useSpring(useTransform(mouseY, [-1000, 1000], [-20, 20]), { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 py-20">
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        className="text-center mb-32 relative"
      >
        <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute -top-20 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">Perjalanan <span className="text-gradient">Kami</span></h2>
        <p className="text-xl text-text-muted font-light max-w-2xl mx-auto">Evolusi dan dedikasi kami dari waktu ke waktu untuk menghadirkan yang terbaik.</p>
      </motion.div>

      <div className="relative">
        {/* Center Line for Desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1.5 bg-white/5 -translate-x-1/2 rounded-full overflow-hidden">
          {/* Animated Line Fill */}
          <motion.div 
            style={{ height: lineHeight }} 
            className="w-full bg-gradient-to-b from-brand-400 via-indigo-500 to-cyan-400 rounded-full"
          />
          {/* Energy Beam */}
          <motion.div 
            style={{ top: beamPosition }}
            className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-white to-transparent opacity-90 blur-[2px] -translate-y-1/2"
          />
        </div>

        {/* Left Line for Mobile */}
        <div className="md:hidden absolute top-0 bottom-0 left-6 w-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            style={{ height: lineHeight }} 
            className="w-full bg-gradient-to-b from-brand-400 via-indigo-500 to-cyan-400 rounded-full"
          />
          <motion.div 
            style={{ top: beamPosition }}
            className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-white to-transparent opacity-90 blur-[2px] -translate-y-1/2"
          />
        </div>

        {/* Particles floating around */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -40, 0],
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-brand-400' : 'bg-cyan-400'} blur-[1px]`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="space-y-20 pl-16 md:pl-0 relative z-10">
          {timelineData.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: isLeft ? -80 : 80, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className={`relative flex flex-col md:flex-row w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'} items-center`}
                style={{ perspective: 1200 }}
              >
                {/* Node Dot */}
                <motion.div 
                  className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-background bg-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.8)] -left-[53px] md:left-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center`}
                  whileInView={{ scale: [1, 1.3, 1], boxShadow: ["0 0 15px rgba(139,92,246,0.4)", "0 0 35px rgba(139,92,246,1)", "0 0 15px rgba(139,92,246,0.4)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.2 }}
                  viewport={{ once: false }}
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </motion.div>

                {/* Card Container */}
                <motion.div 
                  whileHover={{ 
                    scale: 1.03, 
                    rotateX: isLeft ? 2 : -2,
                    rotateY: isLeft ? -3 : 3,
                    boxShadow: "0 25px 50px rgba(139,92,246,0.2)",
                    borderColor: "rgba(168,85,247,0.6)"
                  }}
                  className={`w-full md:w-[42%] glass-premium rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur-[30px] bg-white/[0.03] relative overflow-hidden group transition-all duration-500`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-indigo-500/0 group-hover:from-brand-500/10 group-hover:to-cyan-500/10 transition-colors duration-500"></div>
                  
                  <span className="inline-block py-1.5 px-4 rounded-full bg-brand-500/20 text-brand-300 font-black tracking-widest text-sm mb-5 border border-brand-500/30 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-shadow">
                    {item.year}
                  </span>
                  <h4 className="text-3xl font-bold text-white mb-4 group-hover:text-brand-300 transition-colors">{item.title}</h4>
                  <p className="text-text-muted text-lg font-light leading-relaxed group-hover:text-white/90 transition-colors">{item.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const values = [
    { icon: <FaTrophy />, title: 'Kualitas Terbaik', desc: 'Rumput sintetis berkualitas tinggi untuk memberikan kenyamanan maksimal saat Anda bermain.' },
    { icon: <FaUserFriends />, title: 'Mengutamakan Komunitas', desc: 'Membangun komunitas kampus yang sehat dan aktif melalui olahraga dan kolaborasi bersama.' },
    { icon: <FaLeaf />, title: 'Lingkungan Nyaman', desc: 'Dikelola dengan standar operasional kebersihan yang baik agar lingkungan tetap asri dan nyaman.' },
    { icon: <FaMapMarkerAlt />, title: 'Lokasi Strategis', desc: 'Sangat mudah diakses, terletak tepat di kawasan Politeknik Negeri Lampung.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen text-text-primary overflow-hidden pt-24 pb-16"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-brand-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      {/* Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 pt-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={revealVariants}
        >
          <div className="inline-block py-1 px-4 rounded-full glass-premium text-brand-300 font-medium text-xs mb-6 uppercase tracking-widest border border-brand-500/20">
            Tentang Kami
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Lebih Dari Sekadar <span className="text-gradient">Lapangan</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            POLISOCCER hadir untuk memberikan kemudahan dan kenyamanan dalam berolahraga. Kami memadukan fasilitas fisik yang terawat dengan layanan pemesanan online yang praktis.
          </p>
        </motion.div>
      </div>

      {/* Vision & Mission (Glass Cards) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="glass-premium rounded-3xl p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full"></div>
            <h3 className="text-3xl font-bold text-white mb-6">Visi Kami</h3>
            <p className="text-text-muted text-lg leading-relaxed font-light">
              Menjadi penyedia fasilitas olahraga yang mudah diakses dan memberikan kenyamanan bermain bagi mahasiswa maupun masyarakat umum, guna mendukung gaya hidup sehat.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="glass-premium rounded-3xl p-12 relative overflow-hidden group hover:glass-glow-purple"
          >
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
            <h3 className="text-3xl font-bold text-white mb-6">Misi Kami</h3>
            <ul className="space-y-4 text-text-muted text-lg font-light">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-500"></span>
                Menjaga kualitas lapangan agar selalu nyaman digunakan.
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-500"></span>
                Memberikan kemudahan reservasi melalui sistem online yang transparan.
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-500"></span>
                Membangun semangat kebersamaan dan sportivitas dalam berolahraga.
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Premium Animated Company Timeline */}
      <AnimatedTimeline />

      {/* Values Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-4xl font-bold text-center text-white mb-16 tracking-tighter"
        >
          Mengapa Memilih Kami?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-premium p-8 rounded-3xl hover:glass-glow-purple group transition-all duration-500"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-400 text-2xl mb-6 group-hover:scale-110 group-hover:text-brand-300 transition-all duration-300">
                {val.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{val.title}</h4>
              <p className="text-text-muted font-light leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}