import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GlassButton - Reusable premium button with neon effects
 * variants: 'primary' | 'secondary' | 'ghost' | 'gold'
 */
export default function GlassButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;

    // Ripple effect using React state (no direct DOM manipulation)
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick && onClick(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-neon-red text-white font-bold shadow-neon-red hover:shadow-neon-red-lg hover:bg-red-500 border border-red-500/30',
    secondary:
      'glass-panel text-white font-semibold hover:border-neon-red/40 hover:shadow-neon-red',
    ghost:
      'bg-transparent text-white border border-white/20 font-semibold hover:border-neon-red/60 hover:text-neon-red',
    gold:
      'bg-neon-gold text-black font-bold shadow-neon-gold hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] hover:bg-yellow-400',
  };

  return (
    <motion.button
      ref={btnRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        relative overflow-hidden rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Ripple elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple bg-white/20"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
