import React from 'react';
import { motion } from 'framer-motion';

export default function GlassTable({ columns, data, keyExtractor, emptyMessage = "No data available", onRowClick }) {
  return (
    <div className="glass-premium rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-text-secondary text-sm font-bold tracking-wider uppercase">
              {columns.map((col, index) => (
                <th key={index} className="p-5 font-bold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text-muted font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr 
                  key={keyExtractor ? keyExtractor(row) : rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-all duration-300 hover:bg-white/5 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-5 text-white whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
