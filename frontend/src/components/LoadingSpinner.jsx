import React from 'react';

/**
 * LoadingSpinner - Custom spinner with neon glow
 * sizes: 'sm' | 'md' | 'lg' | 'xl'
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
    xl: 'w-24 h-24 border-4',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer ring */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-dark-800
          border-t-neon-red
          animate-spin
          drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]
        `}
        style={{
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
        }}
      />
      {/* Inner pulsing dot */}
      <div
        className="absolute w-2 h-2 rounded-full bg-neon-red animate-pulse"
        style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 1)' }}
      />
    </div>
  );
}

/**
 * FullPageLoader - Full screen loading overlay
 */
export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-400 text-sm animate-pulse">{text}</p>
    </div>
  );
}
