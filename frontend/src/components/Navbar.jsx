import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CitySelectionModal from './CitySelectionModal';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityLabel, setCityLabel] = useState('Select City');

  useEffect(() => {
    const stored = localStorage.getItem('selectedCity');
    const fromUrl = searchParams.get('city');
    if (fromUrl) {
      setCityLabel(fromUrl);
    } else if (stored) {
      setCityLabel(stored);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCitySelect = (city) => {
    setShowCityModal(false);
    setCityLabel(city || 'All Cities');
    if (city) {
      navigate(`/?city=${encodeURIComponent(city)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-card border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">🎬 MovieBook</span>
            </Link>

            {/* Center: City selector button */}
            <button
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 transition-colors"
            >
              <span>📍</span>
              <span className="max-w-[120px] truncate">{cityLabel}</span>
              <span className="text-gray-400 text-xs">▾</span>
            </button>

            {/* Right: Auth links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="text-gray-400 text-sm hidden sm:inline">Hi, {user?.name}</span>
                  <Link
                    to="/my-bookings"
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-primary hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-primary hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showCityModal && (
        <CitySelectionModal
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </>
  );
}
