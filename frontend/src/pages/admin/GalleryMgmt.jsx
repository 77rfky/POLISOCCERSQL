import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash, FaCalendarAlt } from 'react-icons/fa';

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
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Gallery Management</h1>
          <p className="text-slate-500 mt-1">Upload and manage gallery photos.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          <FaUpload /> Upload Photo
        </button>
      </motion.div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleUpload}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <h3 className="font-bold text-slate-800 mb-4">Upload New Photo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Photo Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Tournament 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Image File</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} required
                className="w-full p-3 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={uploading}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50">
              <FaUpload /> {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => {
            const isUrl = photo.file_gambar.startsWith('http') || photo.file_gambar.startsWith('blob');
            const imgSrc = isUrl ? photo.file_gambar : `http://localhost:5001/uploads/gallery/${photo.file_gambar}`;
            const date = new Date(photo.tgl_upload).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <motion.div key={photo.id_konten} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={imgSrc} alt={photo.judul_foto} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete(photo.id_konten)}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800">{photo.judul_foto}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
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