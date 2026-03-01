import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, getTrendingMovies, syncGenres, syncMovies, regenerateShows } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import TrendingMovies from '../components/TrendingMovies';
import CitySelectionModal from '../components/CitySelectionModal';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') || localStorage.getItem('selectedCity') || '';

  useEffect(() => {
    // Show city modal on first visit (no city stored)
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

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-dark">
      {/* City Selection Modal */}
      {showCityModal && (
        <CitySelectionModal
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}

      {/* Hero Banner */}
      {featuredMovie && (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${featuredMovie.posterUrl || ''})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-white mb-2">{featuredMovie.title}</h1>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-yellow-400 font-bold">
                  ⭐ {featuredMovie.rating ? Number(featuredMovie.rating).toFixed(1) : 'N/A'}
                </span>
                {featuredMovie.certificate && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    {featuredMovie.certificate}
                  </span>
                )}
                {featuredMovie.language && (
                  <span className="bg-gray-700 text-xs px-2 py-0.5 rounded uppercase">
                    {featuredMovie.language}
                  </span>
                )}
                {featuredMovie.region && (
                  <span className="bg-blue-800 text-blue-200 text-xs px-2 py-0.5 rounded">
                    {featuredMovie.region}
                  </span>
                )}
              </div>
              {featuredMovie.description && (
                <p className="text-gray-300 text-sm line-clamp-2">{featuredMovie.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {selectedCity && (
            <span className="text-yellow-400 text-xs">
              📍 City filter active — showing movies in <strong>{selectedCity}</strong>
            </span>
          )}
        </div>

        <FilterBar movies={movies} onFilter={setFilteredMovies} />

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Trending Movies */}
        <TrendingMovies movies={trending} />

        {/* Now Playing */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              🎬 {selectedCity ? `Now Playing in ${selectedCity}` : 'Now Playing'}
              <span className="text-gray-500 text-base font-normal ml-2">({filteredMovies.length} movies)</span>
            </h2>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors border border-gray-700"
            >
              {syncing ? 'Syncing...' : 'Sync from TMDB'}
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl aspect-[2/3] animate-pulse" />
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🎭</div>
              <p className="mb-4">No movies found. Sync movies from TMDB to get started.</p>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="bg-primary hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {syncing ? 'Syncing movies...' : 'Sync Movies from TMDB'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
