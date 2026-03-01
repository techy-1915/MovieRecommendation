import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_POSTER } from '../services/api';

export default function TrendingMovies({ movies }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">🔥 Trending This Week</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <div
            key={movie.movieId}
            onClick={() => navigate(`/movie/${movie.movieId}`)}
            className="flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
              <img
                src={movie.posterUrl || PLACEHOLDER_POSTER}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
              />
            </div>
            <p className="text-white text-xs font-medium mt-2 line-clamp-2 text-center">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
