import React, { useState } from 'react';

const CITIES = [
  { name: 'Mumbai', icon: '🌆' },
  { name: 'Kochi', icon: '🏖️' },
  { name: 'Delhi NCR', icon: '🏛️' },
  { name: 'Bengaluru', icon: '🌳' },
  { name: 'Hyderabad', icon: '🕌' },
  { name: 'Chandigarh', icon: '🌿' },
  { name: 'Ahmedabad', icon: '🏙️' },
  { name: 'Pune', icon: '🏔️' },
  { name: 'Chennai', icon: '🌊' },
  { name: 'Kolkata', icon: '🎭' },
];

export default function CitySelectionModal({ onSelectCity, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cityName) => {
    localStorage.setItem('selectedCity', cityName);
    onSelectCity(cityName);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        // Reverse-geocoding is not implemented; fall back to Mumbai
        handleSelect('Mumbai');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full mx-4 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">Select your city</h2>
        <p className="text-gray-500 text-sm mt-1 mb-4">
          to see movies and events near you
        </p>

        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search for your city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-red-400"
          />
        </div>

        {/* Detect location */}
        <button
          onClick={handleDetectLocation}
          className="text-red-600 text-sm font-medium mb-5 flex items-center gap-1 hover:text-red-700"
        >
          📍 Detect my location
        </button>

        {/* Popular cities */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Popular Cities
        </p>

        <div className="grid grid-cols-5 gap-2">
          {filtered.map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelect(city.name)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span className="text-2xl">{city.icon}</span>
              <span className="text-xs text-center leading-tight text-gray-700 hover:text-red-600">
                {city.name}
              </span>
            </button>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-5">
          <button className="text-red-600 text-sm font-medium hover:text-red-700">
            View All Cities
          </button>
        </div>
      </div>
    </div>
  );
}
