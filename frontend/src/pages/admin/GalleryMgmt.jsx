import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTrash, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import PremiumInput from '../../components/ui/PremiumInput';

const mockPhotos = [
  { id_konten: 1, judul_foto: 'Pertandingan Pembukaan', file_gambar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80', tgl_upload: '2026-06-01T10:00:00Z' },
  { id_konten: 2, judul_foto: 'Fasilitas Lapangan', file_gambar: 'https://images.unsplash.com/photo-1431324155629-1a6d0a11f582?w=400&q=80', tgl_upload: '2026-06-05T14:00:00Z' },
];

export default function GalleryMgmt() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/gallery');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPhotos(data.length ? data : mockPhotos);
    } catch { setPhotos(mockPhotos); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('judul_foto', title);
    formData.append('file_gambar', file);
    try {
      const res = await fetch('http://localhost:5001/api/gallery', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error();
      fetchPhotos();
      setShowForm(false); setTitle(''); setFile(null);
    } catch {
      setPhotos(prev => [...prev, { id_konten: Date.now(), judul_foto: title, file_gambar: URL.createObjectURL(file), tgl_upload: new Date().toISOString() }]);
      setShowForm(false); setTitle(''); setFile(null);
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await fetch(`http://localhost:5001/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchPhotos();
    } catch { setPhotos(prev => prev.filter(p => p.id_konten !== id)); }
  };

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Gallery Management</h1>
          <p className="text-brand-300 font-medium mt-2">Upload and organize promotional content.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all shimmer-button">
          <FaUpload /> Upload Photo
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-premium rounded-[2.5rem] p-8 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 overflow-hidden"
            >
              {/* Modal Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-black text-white tracking-tight">Upload New Photo</h2>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors border border-white/5"><FaTimes /></button>
              </div>
              
              <form onSubmit={handleUpload} className="space-y-5 relative z-10">
                <PremiumInput 
                  label="Photo Title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Tournament 2026" 
                  required
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Image File</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      onChange={e => setFile(e.target.files[0])} 
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-full px-4 py-4 bg-background/50 border border-brand-500/30 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted transition-all hover:bg-brand-500/10 hover:border-brand-500/50">
                      <FaUpload className="text-2xl text-brand-400 mb-1" />
                      <span className="text-sm font-medium text-white">{file ? file.name : 'Click or drag image here'}</span>
                      <span className="text-xs">JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-white/10 text-text-secondary rounded-2xl hover:bg-white/5 hover:text-white font-bold transition-all">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:bg-brand-500 hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all disabled:opacity-50">
                    {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FaUpload />} 
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {photos.map((photo, idx) => {
            const isUrl = photo.file_gambar.startsWith('http') || photo.file_gambar.startsWith('blob');
            const imgSrc = isUrl ? photo.file_gambar : `http://localhost:5001/uploads/gallery/${photo.file_gambar}`;
            const date = new Date(photo.tgl_upload).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <motion.div 
                key={photo.id_konten} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-premium rounded-[2rem] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/10 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10 pointer-events-none"></div>
                
                <div className="relative h-64 overflow-hidden">
                  <img src={imgSrc} alt={photo.judul_foto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Delete Button */}
                  <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                    <button onClick={() => handleDelete(photo.id_konten)} className="p-4 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:scale-110">
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h4 className="font-bold text-white text-xl tracking-wide truncate shadow-sm">{photo.judul_foto}</h4>
                  <div className="flex items-center gap-2 text-sm text-brand-300 mt-2 font-medium">
                    <FaCalendarAlt /> {date}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}