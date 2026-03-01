import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovie, getShows } from '../services/api';
import ShowTimeCard from '../components/ShowTimeCard';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const CITIES = ['', 'Mumbai', 'Delhi', 'Hyderabad'];

  useEffect(() => {
    fetchMovieAndShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedCity]);

  const fetchMovieAndShows = async () => {
    setLoading(true);
    try {
      const [movieRes, showsRes] = await Promise.all([
        getMovie(id),
        getShows(id, selectedCity || undefined),
      ]);
      setMovie(movieRes.data);
      setShows(showsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  // Group shows by theatre
  const showsByTheatre = shows.reduce((acc, show) => {
    const key = show.theatreName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(show);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark">
      {/* Backdrop */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-12">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-36 sm:w-48 rounded-xl shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a1a/DC2626?text=No+Poster'; }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-yellow-400 font-bold">⭐ {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}</span>
              {movie.certificate && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                  {movie.certificate}
                </span>
              )}
              {movie.language && (
                <span className="bg-gray-700 text-xs px-2 py-1 rounded uppercase">{movie.language}</span>
              )}
              {movie.duration && (
                <span className="text-gray-400 text-sm">⏱ {movie.duration} min</span>
              )}
              {movie.releaseDate && (
                <span className="text-gray-400 text-sm">
                  📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>
            )}
          </div>
        </div>

        {/* Show Timings */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">🎟️ Book Tickets</h2>
            {/* City filter */}
            <div className="flex gap-2">
              {[{ label: 'All', value: '' }, ...CITIES.slice(1).map(c => ({ label: c, value: c }))].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedCity(value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCity === value
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {shows.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🎭</div>
              <p>No shows available{selectedCity ? ` in ${selectedCity}` : ''}.</p>
            </div>
          ) : (
            Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
              <div key={theatreName} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  🏛️ {theatreName}
                </h3>
                <div className="flex flex-col gap-3">
                  {theatreShows.map((show) => (
                    <ShowTimeCard key={show.showId} show={show} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
