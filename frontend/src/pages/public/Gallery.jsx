import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const data = await res.json();
        
        if (data && data.length > 0) {
          setPhotos(data);
        } else {
          throw new Error('No photos in database');
        }
      } catch (err) {
        console.warn('API Failed, using mock gallery data:', err);
        setPhotos([
          { id_konten: 1, judul_foto: 'Pertandingan Pembukaan', file_gambar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-10-01T10:00:00Z' },
          { id_konten: 2, judul_foto: 'Fasilitas Ruang Ganti', file_gambar: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-10-05T14:30:00Z' },
          { id_konten: 3, judul_foto: 'Latihan Malam', file_gambar: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce702e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-10-10T19:00:00Z' },
          { id_konten: 4, judul_foto: 'Turnamen Antar Kampus', file_gambar: 'https://images.unsplash.com/photo-1431324155629-1a6d0a11f582?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-11-01T08:00:00Z' },
          { id_konten: 5, judul_foto: 'FIFA Standard Turf', file_gambar: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-11-15T09:00:00Z' },
          { id_konten: 6, judul_foto: 'Suasana Lapangan B', file_gambar: 'https://images.unsplash.com/photo-1551280857-2b9bbe520428?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tgl_upload: '2023-11-20T16:00:00Z' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
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
            Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Foto</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Intip keseruan komunitas dan kemegahan fasilitas di POLISOCCER.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Belum ada foto yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => {
              const dateObj = new Date(photo.tgl_upload);
              const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

              const isUrl = photo.file_gambar.startsWith('http');
              const imgSrc = isUrl ? photo.file_gambar : `http://localhost:5001/uploads/gallery/${photo.file_gambar}`;

              return (
                <motion.div
                  key={photo.id_konten}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={imgSrc} 
                      alt={photo.judul_foto} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{photo.judul_foto}</h3>
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <FaCalendarAlt />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}