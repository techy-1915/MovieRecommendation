import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovie, getTheatresForMovie } from '../services/api';
import HowManySeatsModal from '../components/HowManySeatsModal';
import NeonBadge from '../components/NeonBadge';
import { FullPageLoader } from '../components/LoadingSpinner';
import { staggerContainer, staggerItem } from '../utils/animations';

// ── Utility helpers ──────────────────────────────────────────────────────────

function formatTime(dateTimeStr) {
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(dateObj) {
  return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDayName(dateObj) {
  return dateObj.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();
}

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const FAST_FILLING_THRESHOLD = 20;

const SCREEN_TYPE_OPTIONS = ['All', '2D', '3D', 'IMAX', 'Dolby', '4DX'];
const PRICE_TIER_OPTIONS = ['All', 'Standard', 'Gold', 'Premium'];

export default function Showtimes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const language = searchParams.get('language') || '';
  const format = searchParams.get('format') || '2D';

  const days = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHowManySeatsModal, setShowHowManySeatsModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [screenTypeFilter, setScreenTypeFilter] = useState('All');
  const [priceTierFilter, setPriceTierFilter] = useState('All');

  useEffect(() => {
    const city = localStorage.getItem('selectedCity') ?? undefined;
    const lat = localStorage.getItem('userLat') ? parseFloat(localStorage.getItem('userLat')) : undefined;
    const lng = localStorage.getItem('userLng') ? parseFloat(localStorage.getItem('userLng')) : undefined;
    setLoading(true);
    setError(null);
    Promise.all([getMovie(id), getTheatresForMovie(id, city, lat, lng)])
      .then(([movieRes, theatresRes]) => {
        setMovie(movieRes.data);
        setTheatres(theatresRes.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load showtimes. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredTheatres = theatres
    .map((theatre) => ({
      ...theatre,
      shows: (theatre.shows || []).filter((show) => {
        const showDate = new Date(show.showTime);
        if (!isSameDay(showDate, selectedDate)) return false;
        if (language && show.language && show.language.toUpperCase() !== language.toUpperCase())
          return false;
        if (format && show.format && show.format.toUpperCase() !== format.toUpperCase())
          return false;
        if (screenTypeFilter !== 'All' && show.screenType &&
            show.screenType.toUpperCase() !== screenTypeFilter.toUpperCase())
          return false;
        if (priceTierFilter !== 'All' && show.priceTier &&
            show.priceTier.toLowerCase() !== priceTierFilter.toLowerCase())
          return false;
        return true;
      }),
    }))
    .filter((t) => t.shows.length > 0);

  const handleShowtimeClick = (show) => {
    setSelectedShow(show);
    setShowHowManySeatsModal(true);
  };

  const handleSeatsConfirm = (count) => {
    setShowHowManySeatsModal(false);
    if (selectedShow) {
      navigate(`/booking/${selectedShow.showId}?seats=${count}`);
    }
  };

  if (loading) {
    return <FullPageLoader text="Loading showtimes..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-400 text-lg">Movie not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border-b border-white/5 py-6 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-neon-red text-sm mb-3 flex items-center gap-2 transition-colors"
            aria-label="Go back"
          >
            ← <span>Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">{movie.title}</h1>

          {(language || format) && (
            <p className="text-gray-400 text-sm mt-1">
              {[language, format].filter(Boolean).join(' • ')}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {movie.duration && (
              <NeonBadge variant="gray">⏱ {movie.duration} min</NeonBadge>
            )}
            {movie.certificate && (
              <NeonBadge variant="gold">{movie.certificate}</NeonBadge>
            )}
            {(movie.genres || []).map((g) => (
              <span key={g} className="holographic text-xs text-white/80 px-2.5 py-0.5 rounded-full border border-white/10">
                {g}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Date selector ────────────────────────────────────────────────── */}
      <div className="border-b border-white/5" style={{ background: 'rgba(26,26,26,0.5)' }}>
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto py-4 px-4 scrollbar-hide">
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  flex-none flex flex-col items-center min-w-[68px] px-3 py-2.5 rounded-xl text-xs transition-all duration-300
                  ${isSelected
                    ? 'text-white border border-neon-red/50'
                    : 'text-gray-400 hover:text-gray-200 border border-transparent glass-panel'
                  }
                `}
                style={isSelected ? {
                  background: 'rgba(239, 68, 68, 0.15)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.3)',
                  borderColor: 'rgba(239,68,68,0.5)',
                } : {}}
              >
                <span className="font-semibold">{getDayName(day)}</span>
                <span className={`text-base font-bold leading-tight ${isSelected ? 'text-neon-red' : ''}`}>
                  {String(day.getDate()).padStart(2, '0')}
                </span>
                <span>{day.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="border-b border-white/5" style={{ background: 'rgba(10,10,10,0.8)' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 py-3 px-4">
          {/* Screen type filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-gray-500 text-xs mr-1">Format:</span>
            {SCREEN_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setScreenTypeFilter(opt)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap border
                  ${screenTypeFilter === opt
                    ? 'border-neon-red/50 text-white bg-red-500/20'
                    : 'glass-panel text-gray-300 hover:border-neon-red/30 hover:text-white border-transparent'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {/* Price tier filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-gray-500 text-xs mr-1">Price:</span>
            {PRICE_TIER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setPriceTierFilter(opt)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap border
                  ${priceTierFilter === opt
                    ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10'
                    : 'glass-panel text-gray-300 hover:border-yellow-500/20 hover:text-white border-transparent'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Availability legend ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto flex gap-4 px-4 py-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          AVAILABLE
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block shadow-[0_0_6px_rgba(249,115,22,0.8)] animate-pulse" />
          FAST FILLING
        </span>
      </div>

      {/* ── Theatre listings ─────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto px-4 pb-12 space-y-4"
      >
        {filteredTheatres.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl p-10 text-center text-gray-500 mt-4 border border-white/5"
          >
            <div className="text-4xl mb-3">🎭</div>
            <p>No shows available for {formatDate(selectedDate)}.</p>
          </motion.div>
        ) : (
          filteredTheatres.map((theatre, theatreIndex) => (
            <motion.div
              key={theatre.theatreId}
              variants={staggerItem}
              transition={{ delay: theatreIndex * 0.1 }}
              className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-neon-red/20 transition-all duration-300"
            >
              {/* Theatre header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white text-base">{theatre.theatreName}</h3>
                  {theatre.address && (
                    <p className="text-gray-500 text-xs mt-0.5">{theatre.address}</p>
                  )}
                  {theatre.distanceInKm != null && (
                    <p className="text-blue-400 text-xs mt-0.5">
                      📍 {theatre.distanceInKm.toFixed(1)} km away
                    </p>
                  )}
                </div>
                <div className="flex gap-2 text-lg">
                  <span title="Info" className="cursor-pointer hover:scale-110 transition-transform">ℹ️</span>
                  <span title="Wishlist" className="cursor-pointer hover:scale-110 transition-transform">🤍</span>
                </div>
              </div>

              {/* Showtimes */}
              <div className="flex flex-wrap gap-3 mt-3">
                {theatre.shows.map((show) => {
                  const isFastFilling =
                    show.availableSeatsCount != null &&
                    show.availableSeatsCount <= FAST_FILLING_THRESHOLD;

                  return (
                    <div key={show.showId} className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShowtimeClick(show)}
                        className={`
                          rounded-xl px-4 py-2.5 min-w-[80px] text-center transition-all duration-200 border
                          ${isFastFilling
                            ? 'border-orange-500/50 text-orange-400 bg-orange-500/10 animate-glow-pulse'
                            : 'border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20'
                          }
                        `}
                        style={isFastFilling ? {
                          boxShadow: '0 0 10px rgba(249,115,22,0.3)',
                        } : {
                          boxShadow: '0 0 8px rgba(34,197,94,0.2)',
                        }}
                      >
                        <div className="font-bold text-sm">{formatTime(show.showTime)}</div>
                        {show.screenType && (
                          <div className="text-xs text-gray-400 mt-0.5">{show.screenType}</div>
                        )}
                        {show.screenSize && (
                          <div className="text-xs text-gray-500 mt-0.5">{show.screenSize}</div>
                        )}
                        {show.priceTier && (
                          <div className="text-xs text-yellow-500 mt-0.5">{show.priceTier}</div>
                        )}
                        {isFastFilling && show.availableSeatsCount && (
                          <div className="text-xs text-orange-400 mt-0.5">
                            {show.availableSeatsCount} left
                          </div>
                        )}
                      </motion.button>
                      <div className="text-xs text-gray-600 mt-1">Non-cancellable</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ── How many seats modal ─────────────────────────────────────────── */}
      {showHowManySeatsModal && (
        <HowManySeatsModal
          basePrice={selectedShow?.price}
          onConfirm={handleSeatsConfirm}
          onClose={() => setShowHowManySeatsModal(false)}
        />
      )}
    </div>
  );
}
