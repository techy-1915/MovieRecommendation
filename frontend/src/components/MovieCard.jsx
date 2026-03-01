import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PLACEHOLDER_POSTER } from '../services/api';
import NeonBadge from './NeonBadge';

export default function MovieCard({ movie, index = 0 }) {
  const navigate = useNavigate();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/movie/${movie.movieId}`);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="card-3d cursor-pointer group"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'transform 0.1s ease' : 'transform 0.3s ease',
      }}
    >
      <div
        className={`
          relative rounded-xl overflow-hidden
          border border-white/5
          transition-all duration-300
          ${isHovered
            ? 'shadow-neon-red border-neon-red/30'
            : 'shadow-lg shadow-black/50'
          }
        `}
        style={isHovered ? { boxShadow: '0 0 25px rgba(239, 68, 68, 0.3), 0 20px 40px rgba(0,0,0,0.6)' } : {}}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-dark-800 overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={(e) => {
                e.target.src = PLACEHOLDER_POSTER;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-800">
              <span className="text-gray-500 text-4xl">🎬</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Certificate badge */}
          {movie.certificate && (
            <div className="absolute top-2 left-2">
              <NeonBadge variant="gold">{movie.certificate}</NeonBadge>
            </div>
          )}

          {/* Rating badge */}
          <div className={`absolute top-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="glass-panel rounded-lg px-2 py-1 flex items-center gap-1">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-white text-xs font-bold">
                {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Quick info overlay - slides up on hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="holographic text-xs px-2 py-0.5 rounded-full text-white/90 border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <button className="w-full btn-neon text-xs py-1.5 rounded-lg font-bold">
              Book Now
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-dark-900">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-neon-red transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* Rating (visible when not hovered) */}
            <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-gray-300 text-xs">
                {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
              </span>
            </div>

            {/* Language */}
            {movie.language && (
              <NeonBadge variant="gray">{movie.language.toUpperCase()}</NeonBadge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
