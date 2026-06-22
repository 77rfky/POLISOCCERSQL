import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-brand-500/30">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-background-900 border-t border-white/5 py-16 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-32 bg-brand-600/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-2 mb-6">
              <span className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                P
              </span>
              <span>POLI<span className="text-brand-400">SOCCER</span></span>
            </Link>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Sistem Informasi & Pemesanan Lapangan Mini Soccer Terpadu Politeknik Negeri Lampung. Experience the futuristic pitch.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Pintasan</h4>
            <ul className="space-y-4 text-text-muted font-medium">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Informasi Harga</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-400 transition-colors">Galeri Foto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Hubungi Kami</h4>
            <ul className="space-y-4 text-text-muted font-medium">
              <li>Jl. Soekarno Hatta No. 10</li>
              <li>Bandar Lampung</li>
              <li>info@polisoccer.com</li>
              <li className="text-brand-400">+62 812 3456 7890</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center text-text-muted text-sm font-medium">
          &copy; {new Date().getFullYear()} POLISOCCER Polinela. Crafted with precision.
        </div>
      </footer>
    </div>
  );
}