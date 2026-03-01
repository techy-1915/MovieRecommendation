import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, getTrendingMovies, PLACEHOLDER_POSTER } from '../services/api';
import LanguageFormatModal from '../components/LanguageFormatModal';

// Derive available languages from the movie's own language field
function getMovieLanguages(movie) {
  const langs = [];
  if (movie?.language) {
    langs.push(movie.language.toUpperCase());
  }
  // Add ENGLISH as a common option if not already present
  if (!langs.includes('ENGLISH')) langs.push('ENGLISH');
  return langs;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    fetchMovieData();
    fetchSimilar();
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
      // Show up to 5 movies that are not this one
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
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-400">Movie not found.</div>
      </div>
    );
  }

  const languages = getMovieLanguages(movie);

  return (
    <div className="min-h-screen bg-dark">
      {/* Language & Format Modal */}
      {showLangModal && (
        <LanguageFormatModal
          movieTitle={movie.title}
          languages={languages}
          onSelect={handleLanguageFormatSelect}
          onClose={() => setShowLangModal(false)}
        />
      )}

      {/* Backdrop */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${movie.posterUrl || ''})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 pb-12">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.posterUrl || PLACEHOLDER_POSTER}
              alt={movie.title || 'Movie poster'}
              className="w-36 sm:w-48 rounded-xl shadow-2xl border-2 border-gray-700"
              onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {movie.title || 'Unknown Title'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-yellow-400 font-bold">
                ⭐ {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
              </span>
              {movie.certificate && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                  {movie.certificate}
                </span>
              )}
              {movie.language && (
                <span className="bg-gray-700 text-xs px-2 py-1 rounded uppercase">
                  {movie.language}
                </span>
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

            {/* Genre tags */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g} className="bg-primary/20 text-primary text-sm px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <p className="text-gray-300 text-sm leading-relaxed mb-5">{movie.description}</p>
            )}

            {/* Book Tickets button */}
            <button
              onClick={handleBookTickets}
              className="bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-lg shadow-lg shadow-primary/30"
            >
              🎟️ Book Tickets
            </button>
          </div>
        </div>

        {/* You might also like */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">✨ You might also like</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {similarMovies.map((m) => (
                <div
                  key={m.movieId}
                  onClick={() => navigate(`/movie/${m.movieId}`)}
                  className="flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={m.posterUrl || PLACEHOLDER_POSTER}
                      alt={m.title || 'Movie'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                    />
                    {m.certificate && (
                      <span className="absolute top-1 left-1 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
                        {m.certificate}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <span>⭐</span>
                        <span>{m.rating ? Number(m.rating).toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-xs font-medium mt-2 line-clamp-2 text-center">
                    {m.title || 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

