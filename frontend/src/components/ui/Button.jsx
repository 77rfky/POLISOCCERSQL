import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', // primary, glass, outline
  type = 'button',
  ...props 
}) {
  const ref = useRef(null);
  
  // Magnetic Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  // Ripple Effect State
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Magnetic pull intensity
    x.set((clientX - centerX) * 0.2);
    y.set((clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    if (onClick) onClick(e);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600); // Ripple duration
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  // Styling Variants
  const baseStyle = "relative overflow-hidden inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 transform-gpu cursor-pointer";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]",
    glass: "glass-premium hover:glass-glow-purple text-white hover:-translate-y-1",
    outline: "border border-brand-500/50 text-brand-300 hover:bg-brand-500/10 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Ripple Container */}
      <span className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-full">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute bg-white/30 rounded-full animate-ripple"
            style={{
              left: r.x,
              top: r.y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </span>
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
