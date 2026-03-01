import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Hyderabad', 'Bangalore', 'Chennai'];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') || 'All Cities';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    if (city === 'All Cities') {
      navigate('/');
    } else {
      navigate(`/?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <nav className="bg-card border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">🎬 MovieBook</span>
          </Link>

          {/* Center: City selector */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-primary"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Right: Auth links */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-gray-400 text-sm">Hi, {user?.name}</span>
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
  );
}
