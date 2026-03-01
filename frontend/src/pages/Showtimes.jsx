import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMovie, getTheatresForMovie } from '../services/api';
import HowManySeatsModal from '../components/HowManySeatsModal';

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

// Build an array of the next 7 days starting from today
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

  useEffect(() => {
    const city = localStorage.getItem('selectedCity') ?? undefined;
    setLoading(true);
    setError(null);
    Promise.all([getMovie(id), getTheatresForMovie(id, city)])
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

  // Filter shows by selected date and (if provided) language/format
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

  // ── Loading / Error states ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-dark">
        <div className="text-gray-400 text-lg">Loading showtimes…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-dark">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-dark">
        <div className="text-red-400 text-lg">Movie not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div className="bg-card py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-xl mb-3 flex items-center gap-2 transition-colors"
            aria-label="Go back"
          >
            ← <span className="text-sm">Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">{movie.title}</h1>

          {(language || format) && (
            <p className="text-gray-400 text-sm mt-1">
              {[language, format].filter(Boolean).join(' • ')}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {movie.duration && (
              <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                ⏱ {movie.duration} min
              </span>
            )}
            {movie.certificate && (
              <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                {movie.certificate}
              </span>
            )}
            {(movie.genres || []).map((g) => (
              <span key={g} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Date selector ──────────────────────────────────────────────── */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto py-4 px-4 scrollbar-hide">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex-none flex flex-col items-center min-w-[64px] px-3 py-2 rounded-xl text-xs transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="font-semibold">{getDayName(day)}</span>
                <span className="text-base font-bold leading-tight">
                  {String(day.getDate()).padStart(2, '0')}
                </span>
                <span>{day.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Filter bar ─────────────────────────────────────────────────── */}
      <div className="bg-gray-900/30 border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide">
          {['Language & Format', 'Price Range', 'Special Formats', 'Preferred Time', 'Sort By'].map(
            (label) => (
              <button
                key={label}
                className="flex-none bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-700 hover:border-gray-500 transition-colors whitespace-nowrap"
              >
                {label} ▾
              </button>
            )
          )}
        </div>
      </div>

      {/* ── 4. Availability legend ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto flex gap-4 px-4 py-2 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          AVAILABLE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
          FAST FILLING
        </span>
      </div>

      {/* ── 5. Theatre listings ───────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-4">
        {filteredTheatres.length === 0 ? (
          <div className="bg-card rounded-xl p-10 text-center text-gray-500 mt-4">
            <div className="text-4xl mb-3">🎭</div>
            <p>No shows available for {formatDate(selectedDate)}.</p>
          </div>
        ) : (
          filteredTheatres.map((theatre) => (
            <div key={theatre.theatreId} className="bg-card rounded-xl p-4">
              {/* Theatre header */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white text-base">{theatre.theatreName}</h3>
                <div className="flex gap-2 text-lg">
                  <span title="Info" className="cursor-pointer">ℹ️</span>
                  <span title="Wishlist" className="cursor-pointer">🤍</span>
                </div>
              </div>
              {theatre.address && (
                <p className="text-gray-500 text-xs mb-3">{theatre.address}</p>
              )}

              {/* Showtimes */}
              <div className="flex flex-wrap gap-3">
                {theatre.shows.map((show) => {
                  const isFastFilling =
                    show.availableSeatsCount != null &&
                    show.availableSeatsCount <= FAST_FILLING_THRESHOLD;
                  const borderColor = isFastFilling
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-green-600 text-green-400';

                  return (
                    <div key={show.showId} className="text-center">
                      <button
                        onClick={() => handleShowtimeClick(show)}
                        className={`border ${borderColor} rounded-lg px-4 py-2 min-w-[80px] text-center hover:bg-white/5 transition-colors`}
                      >
                        <div className="font-bold text-sm">{formatTime(show.showTime)}</div>
                        {show.screenType && (
                          <div className="text-xs text-gray-400">{show.screenType}</div>
                        )}
                      </button>
                      <div className="text-xs text-gray-500 mt-1">Non-cancellable</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── 6. How many seats modal ───────────────────────────────────────── */}
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
