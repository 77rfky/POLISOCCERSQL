import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-4 glass-premium border-b border-white/5 shadow-2xl' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                P
              </span>
              <span>POLI<span className="text-brand-400">SOCCER</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 glass-premium px-6 py-2 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-4 py-2 group"
                >
                  <span className={`relative z-10 font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {link.name}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover Glow Underline */}
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-brand-400 transition-all duration-300 group-hover:w-1/2 shadow-[0_0_10px_rgba(168,85,247,0.8)] ${isActive ? 'w-1/2 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-300 font-bold hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
              Login
            </Link>
            <Link to="/register">
              <Button variant="primary" className="!py-2 !px-6 text-sm">
                Book Field
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
