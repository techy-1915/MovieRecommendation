import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_POSTER } from '../services/api';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-2xl hover:shadow-primary/20"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = PLACEHOLDER_POSTER;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-500 text-4xl">🎬</span>
          </div>
        )}
        {/* Certificate badge */}
        {movie.certificate && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
            {movie.certificate}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-gray-300 text-xs">
              {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
            </span>
          </div>

          {/* Language */}
          {movie.language && (
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded uppercase">
              {movie.language}
            </span>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
