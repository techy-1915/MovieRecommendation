import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovie, getTrendingMovies, PLACEHOLDER_POSTER } from '../services/api';
import LanguageFormatModal from '../components/LanguageFormatModal';
import { FullPageLoader } from '../components/LoadingSpinner';
import NeonBadge from '../components/NeonBadge';
import { fadeInUp, staggerContainer } from '../utils/animations';

// Derive available languages from the movie's own language field
function getMovieLanguages(movie) {
  const langs = [];
  if (movie?.language) {
    langs.push(movie.language.toUpperCase());
  }
  if (!langs.includes('ENGLISH')) langs.push('ENGLISH');
  return langs;
}

// Animated counter for ratings using requestAnimationFrame
function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let startTime = null;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(startValue + eased * (target - startValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <span>{count.toFixed(1)}</span>;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  useEffect(() => {
    fetchMovieData();
    fetchSimilar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const movieRes = await getMovie(id);
      setMovie(movieRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async () => {
    try {
      const res = await getTrendingMovies();
      const others = (res.data || []).filter(
        (m) => String(m.movieId) !== String(id)
      ).slice(0, 5);
      setSimilarMovies(others);
    } catch {
      // similar movies are optional
    }
  };

  const handleBookTickets = () => {
    setShowLangModal(true);
  };

  const handleLanguageFormatSelect = ({ language, format }) => {
    setShowLangModal(false);
    navigate(
      `/movie/${id}/showtimes?language=${encodeURIComponent(language)}&format=${encodeURIComponent(format)}`
    );
  };

  if (loading) {
    return <FullPageLoader text="Loading movie details..." />;
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-400">Movie not found.</div>
      </div>
    );
  }

  const languages = getMovieLanguages(movie);
  const isLongDescription = movie.description && movie.description.length > 200;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Language & Format Modal */}
      {showLangModal && (
        <LanguageFormatModal
          movieTitle={movie.title}
          languages={languages}
          onSelect={handleLanguageFormatSelect}
          onClose={() => setShowLangModal(false)}
        />
      )}

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-96 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.posterUrl || ''})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />

        {/* Neon scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.1) 2px, rgba(239,68,68,0.1) 4px)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 relative z-10 pb-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col sm:flex-row gap-6"
        >
          {/* ── Poster with 3D frame ──────────────────────────────────────── */}
          <motion.div
            variants={fadeInUp}
            className="flex-shrink-0 group"
          >
            <div
              className="relative w-36 sm:w-48 rounded-xl overflow-hidden border border-white/10"
              style={{
                boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239,68,68,0.2)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <img
                src={movie.posterUrl || PLACEHOLDER_POSTER}
                alt={movie.title || 'Movie poster'}
                className="w-full block"
                onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
              />
              {/* Holographic sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* ── Details ──────────────────────────────────────────────────── */}
          <motion.div variants={fadeInUp} className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
              {movie.title || 'Unknown Title'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Animated rating */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
                style={{
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.3)',
                  boxShadow: '0 0 10px rgba(251,191,36,0.2)',
                }}
              >
                <span className="text-yellow-400">⭐</span>
                <span className="text-yellow-400 font-bold text-lg">
                  {movie.rating ? <AnimatedCounter target={Number(movie.rating)} /> : 'N/A'}
                </span>
                <span className="text-gray-500 text-xs">/10</span>
              </div>

              {movie.certificate && (
                <NeonBadge variant="gold">{movie.certificate}</NeonBadge>
              )}
              {movie.language && (
                <NeonBadge variant="gray">{movie.language.toUpperCase()}</NeonBadge>
              )}
              {movie.duration && (
                <span className="text-gray-400 text-sm">⏱ {movie.duration} min</span>
              )}
              {movie.releaseDate && (
                <span className="text-gray-400 text-sm">
                  📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Genre tags with gradient glow */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="holographic text-white/90 text-sm px-3 py-1 rounded-full border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Description with expand/collapse */}
            {movie.description && (
              <div className="mb-5">
                <p className={`text-gray-300 text-sm leading-relaxed ${!synopsisExpanded && isLongDescription ? 'line-clamp-3' : ''}`}>
                  {movie.description}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="text-neon-red text-xs mt-1 hover:text-red-400 transition-colors"
                  >
                    {synopsisExpanded ? '▲ Show less' : '▼ Read more'}
                  </button>
                )}
              </div>
            )}

            {/* Book Tickets button with neon glow and ripple */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleBookTickets}
                className="btn-neon text-white font-bold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3"
                style={{
                  boxShadow: '0 0 30px rgba(239,68,68,0.6)',
                  animation: 'glow-pulse 2s ease-in-out infinite',
                }}
              >
                🎟️ Book Tickets
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Similar Movies ────────────────────────────────────────────── */}
        {similarMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              <span className="shimmer-text">✨ You might also like</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {similarMovies.map((m, i) => (
                <motion.div
                  key={m.movieId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/movie/${m.movieId}`)}
                  className="flex-shrink-0 w-32 cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800 border border-white/5 group-hover:border-neon-red/30 transition-all duration-300 group-hover:shadow-neon-red">
                    <img
                      src={m.posterUrl || PLACEHOLDER_POSTER}
                      alt={m.title || 'Movie'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                    />
                    {m.certificate && (
                      <div className="absolute top-1 left-1">
                        <NeonBadge variant="gold">{m.certificate}</NeonBadge>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-2">
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <span>⭐</span>
                        <span>{m.rating ? Number(m.rating).toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-xs font-medium mt-2 line-clamp-2 text-center group-hover:text-neon-red transition-colors">
                    {m.title || 'Unknown'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
