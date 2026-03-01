import React, { useEffect } from 'react';

export default function SuccessAnimation({ bookingId, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <style>{`
        @keyframes circle-grow {
          0% { stroke-dashoffset: 283; opacity: 0; }
          40% { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes check-draw {
          0% { stroke-dashoffset: 80; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
        }
        .success-circle {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: circle-grow 0.8s ease-out forwards;
        }
        .check-path {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: check-draw 0.5s ease-out 0.6s forwards;
          opacity: 0;
        }
        .success-icon {
          animation: bounce-in 0.8s ease-out forwards;
        }
        .success-text {
          animation: fade-up 0.5s ease-out 0.8s both;
        }
        .booking-id-text {
          animation: fade-up 0.5s ease-out 1.0s both;
        }
        .confetti-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: confetti-fall 1.5s ease-in forwards;
        }
      `}</style>

      <div className="bg-white rounded-2xl p-10 max-w-sm w-full mx-4 text-center relative overflow-hidden">
        {/* Confetti dots */}
        {['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#06b6d4','#f97316'].map((color, i) => (
          <div
            key={i}
            className="confetti-dot"
            style={{
              backgroundColor: color,
              left: `${10 + i * 11}%`,
              top: '-10px',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}

        {/* Animated checkmark */}
        <div className="success-icon flex justify-center mb-5">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              className="success-circle"
              transform="rotate(-90 50 50)"
            />
            <path
              d="M28 50 L43 65 L72 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-path"
            />
          </svg>
        </div>

        <h2 className="success-text text-2xl font-bold text-gray-800 mb-2">
          Booking Successful! 🎉
        </h2>
        <p className="booking-id-text text-gray-500 text-sm">
          Booking ID: <span className="font-bold text-gray-700">#{bookingId}</span>
        </p>
        <p className="booking-id-text text-gray-400 text-xs mt-2">
          Redirecting to your ticket...
        </p>
      </div>
    </div>
  );
}
