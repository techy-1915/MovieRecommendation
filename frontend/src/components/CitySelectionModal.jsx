import React, { useState } from 'react';

// Approximate coordinates for popular Indian cities
const CITY_COORDS = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  'Delhi NCR': { lat: 28.7041, lng: 77.1025 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
};

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
  const [detecting, setDetecting] = useState(false);

  const filtered = CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cityName) => {
    localStorage.setItem('selectedCity', cityName);
    const coords = CITY_COORDS[cityName];
    if (coords) {
      localStorage.setItem('userLat', String(coords.lat));
      localStorage.setItem('userLng', String(coords.lng));
    }
    onSelectCity(cityName);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('userLat', String(latitude));
        localStorage.setItem('userLng', String(longitude));
        // Find closest city as display label
        let closestCity = 'Mumbai';
        let minDist = Infinity;
        Object.entries(CITY_COORDS).forEach(([name, coords]) => {
          const d = Math.hypot(coords.lat - latitude, coords.lng - longitude);
          if (d < minDist) { minDist = d; closestCity = name; }
        });
        localStorage.setItem('selectedCity', closestCity);
        setDetecting(false);
        onSelectCity(closestCity);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setDetecting(false);
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
          disabled={detecting}
          className="text-red-600 text-sm font-medium mb-5 flex items-center gap-1 hover:text-red-700 disabled:opacity-50"
        >
          📍 {detecting ? 'Detecting...' : 'Detect my location'}
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
