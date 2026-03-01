import React from 'react';
import ShowTimeCard from './ShowTimeCard';

export default function TheatreList({ shows }) {
  if (!shows || shows.length === 0) {
    return (
      <div className="bg-card rounded-xl p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">🎭</div>
        <p>No shows available.</p>
      </div>
    );
  }

  const showsByTheatre = shows.reduce((acc, show) => {
    const key = show.theatreName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(show);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
        <div key={theatreName} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
            🏛️ {theatreName}
            <span className="text-gray-500 text-sm font-normal">• {theatreShows[0]?.city}</span>
          </h3>
          <div className="flex flex-col gap-3">
            {theatreShows.map((show) => (
              <ShowTimeCard key={show.showId} show={show} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
