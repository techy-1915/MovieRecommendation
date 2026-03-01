import React from 'react';

/**
 * NeonBadge - Badges with glow effects
 * variants: 'red' | 'gold' | 'green' | 'blue' | 'gray'
 */
export default function NeonBadge({ children, variant = 'red', className = '' }) {
  const variantClasses = {
    red: 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    gold: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-[0_0_8px_rgba(251,191,36,0.3)]',
    green: 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]',
    gray: 'bg-gray-700/50 text-gray-300 border border-gray-600/40',
    orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.3)]',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
