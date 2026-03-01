import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMovies, getTrendingMovies, syncGenres, syncMovies, regenerateShows } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import TrendingMovies from '../components/TrendingMovies';
import CitySelectionModal from '../components/CitySelectionModal';
import GlassButton from '../components/GlassButton';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: '50%', y: '50%' });
  const heroRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') || localStorage.getItem('selectedCity') || '';

  useEffect(() => {
    if (!localStorage.getItem('selectedCity') && !searchParams.get('city')) {
      setShowCityModal(true);
    }
    fetchMovies();
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCity) {
        params.city = selectedCity;
      }
      const res = await getMovies(params);
      setMovies(res.data);
      setFilteredMovies(res.data);
    } catch (err) {
      setError('Failed to load movies. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await getTrendingMovies();
      setTrending(res.data.slice(0, 10));
    } catch {
      // trending is optional
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      await syncGenres();
      await syncMovies();
      await regenerateShows();
      await fetchMovies();
      await fetchTrending();
    } catch {
      setError('Sync failed. Check your TMDB API key and ensure the backend is running.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCitySelect = (city) => {
    setShowCityModal(false);
    if (city) {
      setSearchParams({ city });
    } else {
      setSearchParams({});
    }
  };

  const handleHeroMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    });
  }, []);

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* City Selection Modal */}
      {showCityModal && (
        <CitySelectionModal
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {featuredMovie && (
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-72 sm:h-[420px] overflow-hidden cursor-crosshair"
            onMouseMove={handleHeroMouseMove}
          >
            {/* Background image with parallax */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${featuredMovie.posterUrl || ''})` }}
            />

            {/* Dark overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

            {/* Mouse-follow spotlight */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(400px circle at ${spotlightPos.x} ${spotlightPos.y}, rgba(239, 68, 68, 0.08), transparent 60%)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
              <div className="max-w-lg">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Featured label */}
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-neon-red mb-3 neon-text-red">
                    ✦ Featured Film
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                    {featuredMovie.title}
                  </h1>

                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-yellow-400 font-bold neon-text-gold">
                      ⭐ {featuredMovie.rating ? Number(featuredMovie.rating).toFixed(1) : 'N/A'}
                    </span>
                    {featuredMovie.certificate && (
                      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-bold px-2 py-0.5 rounded">
                        {featuredMovie.certificate}
                      </span>
                    )}
                    {featuredMovie.language && (
                      <span className="glass-panel text-gray-300 text-xs px-2 py-0.5 rounded uppercase">
                        {featuredMovie.language}
                      </span>
                    )}
                    {featuredMovie.genres?.slice(0, 2).map((g) => (
                      <span key={g} className="holographic text-xs px-2 py-0.5 rounded-full text-white/80 border border-white/10">
                        {g}
                      </span>
                    ))}
                  </div>

                  {featuredMovie.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-5 max-w-md">
                      {featuredMovie.description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City filter pill */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              <span className="glass-panel text-yellow-400 text-xs px-3 py-1.5 rounded-full border border-yellow-500/20">
                📍 Showing movies in <strong>{selectedCity}</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Bar */}
        <FilterBar movies={movies} onFilter={setFilteredMovies} />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel border border-red-500/30 text-red-300 rounded-xl p-4 mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Movies */}
        <TrendingMovies movies={trending} />

        {/* Now Playing */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white flex items-center gap-3"
            >
              <span className="neon-text-red">🎬</span>
              <span>
                {selectedCity ? `Now Playing in ${selectedCity}` : 'Now Playing'}
              </span>
              <span className="text-gray-600 text-base font-normal">
                ({filteredMovies.length})
              </span>
            </motion.h2>

            <GlassButton
              onClick={handleSync}
              disabled={syncing}
              variant="secondary"
              size="sm"
            >
              {syncing ? '⟳ Syncing...' : '⟳ Sync TMDB'}
            </GlassButton>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl aspect-[2/3] bg-dark-800 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
                      animation: 'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl text-center py-16 border border-white/5"
            >
              <div className="text-6xl mb-4">🎭</div>
              <p className="text-gray-400 mb-6">No movies found. Sync movies from TMDB to get started.</p>
              <GlassButton
                onClick={handleSync}
                disabled={syncing}
                variant="primary"
              >
                {syncing ? '⟳ Syncing movies...' : '⟳ Sync Movies from TMDB'}
              </GlassButton>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie.movieId} movie={movie} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
