import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaCalendarAlt, FaTimes, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCheckCircle, FaExpandAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

// Mock Premium Data
const PREMIUM_FEATURES = [
  "FIFA Standard Artificial Turf",
  "Premium LED Lighting System",
  "Spectator Seating Area",
  "High-Speed Wi-Fi Access",
  "Clean Shower Facilities",
  "Secure Parking Area",
  "Digital Scoreboard",
  "Player Bench with Canopy"
];

const MOCK_DESCRIPTIONS = [
  "Experience world-class football on our meticulously maintained pitches. Designed for professional training and competitive matches.",
  "Our premium facilities offer the perfect environment for your team to develop and perform at their peak.",
  "Enjoy an immersive sporting experience with state-of-the-art lighting and top-tier amenities for all players.",
  "The ultimate destination for football enthusiasts looking for premium quality and comfort in every game."
];

const getPremiumData = (id) => {
  const index = (id || 0) % MOCK_DESCRIPTIONS.length;
  const features = [];
  for(let i=0; i<4; i++) {
    features.push(PREMIUM_FEATURES[(id + i) % PREMIUM_FEATURES.length]);
  }
  return {
    description: MOCK_DESCRIPTIONS[index],
    shortDesc: MOCK_DESCRIPTIONS[index].split('.')[0] + '.',
    features
  };
};

const getSpanClasses = (index) => {
  const pattern = [
    "md:col-span-2 md:row-span-2", // Large feature
    "md:col-span-1 md:row-span-1", // Standard
    "md:col-span-1 md:row-span-2", // Tall
    "md:col-span-1 md:row-span-1", // Standard
    "md:col-span-2 md:row-span-1", // Wide
    "md:col-span-1 md:row-span-1", // Standard
  ];
  return pattern[index % pattern.length];
};

const Particles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-brand-400"
          initial={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.1,
            scale: Math.random() * 2 + 0.5,
          }}
          animate={{
            y: [0, Math.random() * -150 - 50],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, Math.random() * 0.5 + 0.2, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            boxShadow: '0 0 10px 2px rgba(139, 92, 246, 0.4)'
          }}
        />
      ))}
    </div>
  );
};

export default function Gallery() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const data = await res.json();
        setPhotos(data || []);
      } catch (err) {
        console.warn('API Failed or no data:', err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <div className="bg-[#050816] min-h-screen pt-32 pb-24 relative overflow-hidden text-white selection:bg-brand-500/30">
      {/* Ambient Lighting & Particles */}
      <Particles />
      <motion.div style={{ y: yBg }} className="absolute top-0 left-0 w-full h-[150vh] pointer-events-none z-0">
        <div className="absolute top-[5%] right-[10%] w-[40rem] h-[40rem] bg-brand-600/15 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[5%] w-[50rem] h-[50rem] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-brand-300 font-medium text-xs mb-6 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(139,92,246,0.15)]"
          >
            <FaExpandAlt className="w-3 h-3" /> Visual Experience
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tighter mb-6"
          >
            Premium <span className="text-brand-400">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore our state-of-the-art facilities through an immersive visual showcase. Designed for champions, built for everyone.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-16 h-16 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin shadow-[0_0_40px_rgba(139,92,246,0.5)]"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-32 text-white/40 font-light text-xl border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-md">
            Belum ada foto yang diunggah.
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[300px]"
          >
            {photos.map((photo, index) => {
              const dateObj = new Date(photo.tgl_upload);
              const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              const isUrl = photo.file_gambar.startsWith('http');
              const imgSrc = isUrl ? photo.file_gambar : `http://localhost:5001/uploads/gallery/${photo.file_gambar}`;
              const premiumData = getPremiumData(photo.id_konten);
              
              return (
                <motion.div
                  key={photo.id_konten}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: (index % 6) * 0.1, 
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative rounded-3xl overflow-hidden group cursor-pointer bg-white/5 border border-white/10 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-500 ${getSpanClasses(index)}`}
                  onClick={() => setSelectedIndex(index)}
                  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                  <motion.img 
                    src={imgSrc} 
                    alt={photo.judul_foto} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ transformOrigin: 'center center' }}
                  />
                  
                  {/* Purple Glow Border on Hover */}
                  <div className="absolute inset-0 border-2 border-brand-400/0 group-hover:border-brand-400/50 rounded-3xl transition-colors duration-500 z-20 pointer-events-none"></div>

                  {/* Glass Overlay */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 md:top-2/3 bg-gradient-to-t from-[#050816]/95 via-[#050816]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 translate-y-8 group-hover:translate-y-0 z-10">
                    <div className="relative z-20">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                        {photo.judul_foto}
                      </h3>
                      <p className="text-white/70 text-sm font-light mb-4 line-clamp-2">{premiumData.shortDesc}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-xs text-brand-300 font-medium uppercase tracking-widest gap-2 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
                          <FaCalendarAlt />
                          <span>{dateStr}</span>
                        </div>
                        <span className="text-white font-medium text-sm tracking-wide flex items-center gap-2 group/btn">
                          Explore <FaExpandAlt className="w-3 h-3 group-hover/btn:rotate-45 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Fullscreen Premium Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050816]/80 backdrop-blur-[30px]"
          >
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:rotate-90 hover:border-brand-500/50 transition-all duration-500 z-50 backdrop-blur-xl"
              onClick={() => setSelectedIndex(null)}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            {selectedIndex > 0 && (
              <button 
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:-translate-x-2 transition-all duration-300 z-50 backdrop-blur-xl"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
            )}
            {selectedIndex < photos.length - 1 && (
              <button 
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:translate-x-2 transition-all duration-300 z-50 backdrop-blur-xl"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            )}
            
            <motion.div 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl max-h-[90vh] flex flex-col lg:flex-row bg-[#0a0f25]/60 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.15)] backdrop-blur-2xl mx-4 md:mx-12 lg:mx-24 z-40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="w-full lg:w-[60%] h-[40vh] lg:h-auto relative bg-black">
                {(() => {
                  const currentPhoto = photos[selectedIndex];
                  const isUrl = currentPhoto.file_gambar.startsWith('http');
                  const imgSrc = isUrl ? currentPhoto.file_gambar : `http://localhost:5001/uploads/gallery/${currentPhoto.file_gambar}`;
                  return (
                    <img 
                      src={imgSrc} 
                      alt={currentPhoto.judul_foto} 
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0f25]/80 hidden lg:block pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f25]/80 to-transparent lg:hidden pointer-events-none"></div>
              </div>
              
              {/* Content Section */}
              <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                {(() => {
                  const currentPhoto = photos[selectedIndex];
                  const premiumData = getPremiumData(currentPhoto.id_konten);
                  
                  return (
                    <>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-widest w-fit mb-6">
                        <FaMapMarkerAlt /> POLISOCCER ARENA
                      </div>
                      
                      <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                        {currentPhoto.judul_foto}
                      </h2>
                      
                      <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
                        {premiumData.description}
                      </p>

                      <div className="mb-10">
                        <h4 className="text-white font-medium tracking-widest uppercase text-sm mb-4 opacity-80 border-b border-white/10 pb-2">Premium Features</h4>
                        <ul className="space-y-3">
                          {premiumData.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-white/70 font-light">
                              <FaCheckCircle className="text-brand-400 text-sm flex-shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto pt-6">
                        <Button 
                          onClick={() => navigate('/booking')} 
                          variant="primary" 
                          className="w-full !py-4 text-lg font-bold shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-shadow duration-300"
                        >
                          Book Now
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}