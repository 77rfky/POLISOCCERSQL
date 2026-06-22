import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumInput({ 
  label, 
  icon: Icon, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  name
}) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-bold text-text-secondary tracking-wide">{label}</label>}
      <div className="relative group/input">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-brand-400 transition-colors" />}
        <input 
          type={type} 
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-background/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder-text-muted transition-all shadow-inner`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
