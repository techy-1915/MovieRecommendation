import React, { useState } from 'react';

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

const PRICE_CATEGORIES = [
  { name: 'PLATINUM', price: 350, status: 'ALMOST FULL', statusClass: 'text-orange-500' },
  { name: 'GOLD', price: 295, status: 'AVAILABLE', statusClass: 'text-green-500' },
  { name: 'LOUNGERS', price: 295, status: 'AVAILABLE', statusClass: 'text-green-500' },
];

export default function HowManySeatsModal({ onConfirm, onClose, showPrice, priceCategories }) {
  const [selected, setSelected] = useState(2);

  const categories = priceCategories || PRICE_CATEGORIES;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-sm w-full mx-4 rounded-2xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          How many seats?
        </h2>

        {/* Scooter emoji */}
        <div className="text-5xl text-center mb-5">🛵</div>

        {/* Seat number selector */}
        <div className="flex justify-center gap-3 mb-6">
          {SEAT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                selected === n
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Price categories */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
          {categories.map((cat) => (
            <div key={cat.name} className="flex justify-between items-center">
              <span className="text-gray-700 font-medium text-sm">
                {cat.name} ₹{showPrice != null ? showPrice : cat.price}
              </span>
              <span className={`text-xs font-semibold ${cat.statusClass}`}>
                {cat.status}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onConfirm(selected)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Select Seats
        </button>
      </div>
    </div>
  );
}
