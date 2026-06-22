import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DashboardSidebar({ menuItems, role }) {
  const location = useLocation();

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-6 bottom-6 w-[280px] glass-premium rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="p-8 pb-4 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
        <Link to="/" className="inline-flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <span className="text-white font-black text-xl tracking-tighter">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">POLISOCCER</h1>
            <p className="text-xs text-brand-300 font-bold uppercase tracking-widest mt-1">{role} PANEL</p>
          </div>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-2 scrollbar-hide relative z-10">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={index} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'bg-brand-500/20 border border-brand-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                    : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon className={`text-xl transition-colors duration-300 ${isActive ? 'text-brand-300' : 'group-hover:text-brand-400'}`} />
                <span className="font-bold tracking-wide">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer (Logout/Profile Mini) */}
      <div className="p-6 relative z-10 border-t border-white/5">
        <Link to="/login" onClick={() => localStorage.clear()} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-bold tracking-wide">Sign Out</span>
        </Link>
      </div>
    </motion.aside>
  );
}
