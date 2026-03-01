import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CitySelectionModal from './CitySelectionModal';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityLabel, setCityLabel] = useState('Select City');
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('selectedCity');
    const fromUrl = searchParams.get('city');
    if (fromUrl) {
      setCityLabel(fromUrl);
    } else if (stored) {
      setCityLabel(stored);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`
          sticky top-0 z-40 transition-all duration-300
          ${scrolled
            ? 'glass-panel shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5'
            : 'bg-dark-900/80 backdrop-blur-sm border-b border-white/5'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.span
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{ scale: 1.05 }}
              >
                🎬 CineBook
              </motion.span>
            </Link>

            {/* Center: City selector button */}
            <motion.button
              onClick={() => setShowCityModal(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 glass-panel-light hover:border-neon-red/30 text-white text-sm rounded-lg px-3 py-2 transition-all duration-200"
            >
              <span className="text-neon-red">📍</span>
              <span className="max-w-[120px] truncate font-medium">{cityLabel}</span>
              <span className="text-gray-400 text-xs">▾</span>
            </motion.button>

            {/* Right: Auth links */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 glass-panel-light rounded-lg px-3 py-2 text-sm transition-all"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-red to-red-700 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">{user?.name}</span>
                    <span className="text-gray-500 text-xs">▾</span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 glass-panel rounded-xl overflow-hidden shadow-glass border border-white/10"
                      >
                        <Link
                          to="/my-bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          🎫 My Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-white/5"
                        >
                          🚪 Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/auth"
                    className="btn-neon text-sm px-4 py-2 rounded-lg inline-block"
                    style={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {showCityModal && (
        <CitySelectionModal
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </>
  );
}
