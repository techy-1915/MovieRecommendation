import React, { useState, useEffect } from 'react';

const LANGUAGES = ['All', 'en', 'hi', 'te', 'ta', 'ml', 'kn'];
const SORT_OPTIONS = ['Default', 'Rating', 'Release Date'];

export default function FilterBar({ movies, onFilter }) {
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [search, setSearch] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (movies && movies.length > 0) {
      const allGenres = new Set();
      movies.forEach((m) => {
        (m.genres || []).forEach((g) => allGenres.add(g));
      });
      setGenres(['All', ...Array.from(allGenres).sort()]);
    }
  }, [movies]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre, language, sortBy, search]);

  const applyFilters = () => {
    if (!movies) return;
    let filtered = [...movies];

    if (search.trim()) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genre !== 'All') {
      filtered = filtered.filter((m) => (m.genres || []).includes(genre));
    }
    if (language !== 'All') {
      filtered = filtered.filter((m) => m.language === language);
    }
    if (sortBy === 'Rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Release Date') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    onFilter(filtered);
  };

  return (
    <div className="bg-card rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:border-primary flex-1 min-w-[200px]"
      />

      {/* Genre filter */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-primary"
      >
        {genres.map((g) => (
          <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
        ))}
      </select>

      {/* Language filter */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-primary"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l === 'All' ? 'All Languages' : l.toUpperCase()}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-primary"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>Sort: {opt}</option>
        ))}
      </select>
    </div>
  );
}
