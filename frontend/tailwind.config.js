/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        dark: {
          DEFAULT: '#0f0f0f',
          950: '#0a0a0a',
          900: '#1a1a1a',
          800: '#2d2d2d',
        },
        card: '#1a1a1a',
        neon: {
          red: '#ef4444',
          gold: '#fbbf24',
        },
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'neon-red-lg': '0 0 40px rgba(239, 68, 68, 0.8)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(239, 68, 68, 0.9)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(2%, -1%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(1%, -4%)' },
          '70%': { transform: 'translate(-2%, 1%)' },
          '80%': { transform: 'translate(3%, -2%)' },
          '90%': { transform: 'translate(-1%, 3%)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'spin-glow': {
          '0%': { transform: 'rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)', filter: 'hue-rotate(360deg)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'draw-check': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        grain: 'grain 8s steps(10) infinite',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        ripple: 'ripple 0.6s linear',
        'spin-glow': 'spin-glow 1s linear infinite',
        confetti: 'confetti 2s ease-in forwards',
        'draw-check': 'draw-check 0.5s ease-out forwards',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      },
    },
  },
  plugins: [],
}
