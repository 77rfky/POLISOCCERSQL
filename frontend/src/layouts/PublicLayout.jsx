import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="fixed w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-gradient tracking-tight">
                POLISOCCER
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">Tentang Kami</Link>
              <Link to="/pricing" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">Daftar Harga</Link>
              <Link to="/gallery" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">Galeri</Link>
              <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 transition-colors ml-4">Masuk</Link>
              <Link to="/register" className="bg-gradient-primary text-white px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5">
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-4 tracking-tight">POLISOCCER</h3>
            <p className="text-slate-400 leading-relaxed">Sistem Informasi & Pemesanan Lapangan Mini Soccer Terpadu Politeknik Negeri Lampung.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Pintasan</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Informasi Harga</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Galeri Foto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hubungi Kami</h4>
            <p className="text-slate-400">Jl. Soekarno Hatta No. 10, Rajabasa, Bandar Lampung</p>
            <p className="text-slate-400 mt-2">Email: info@polisoccer.com</p>
            <p className="text-slate-400 mt-2">WA: +62 812 3456 7890</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} POLISOCCER Polinela. All rights reserved.
        </div>
      </footer>
    </div>
  );
}