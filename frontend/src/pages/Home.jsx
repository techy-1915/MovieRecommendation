import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, getTrendingMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') || '';

  useEffect(() => {
    fetchMovies();
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = selectedCity ? { city: selectedCity } : {};
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
      setTrending(res.data.slice(0, 6));
    } catch {
      // trending is optional
    }
  };

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Banner */}
      {featuredMovie && (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-white mb-2">{featuredMovie.title}</h1>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-yellow-400">⭐ {featuredMovie.rating}</span>
                {featuredMovie.language && (
                  <span className="bg-gray-700 text-xs px-2 py-0.5 rounded uppercase">
                    {featuredMovie.language}
                  </span>
                )}
                {featuredMovie.certificate && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    {featuredMovie.certificate}
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">{featuredMovie.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar movies={movies} onFilter={setFilteredMovies} />

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Now Playing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            🎬 Now Playing
            <span className="text-gray-500 text-base font-normal ml-2">({filteredMovies.length} movies)</span>
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl aspect-[2/3] animate-pulse" />
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🎭</div>
              <p>No movies found. Try syncing movies from TMDB.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Movies */}
        {trending.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">🔥 Trending</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
