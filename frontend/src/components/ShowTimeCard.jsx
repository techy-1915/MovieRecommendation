import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShowTimeCard({ show }) {
  const navigate = useNavigate();

  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleBook = () => {
    navigate(`/booking/${show.showId}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-semibold">{show.theatreName}</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-400 text-sm">{show.screenName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-lg">
            {formatTime(show.showTime)}
          </span>
          <span className="text-gray-400 text-sm">{formatDate(show.showTime)}</span>
          <span className="text-gray-300 text-sm">📍 {show.city}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-green-400 font-bold text-lg">₹{show.price}</div>
          <div className="text-gray-500 text-xs">per seat</div>
        </div>
        <button
          onClick={handleBook}
          className="bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Book
        </button>
      </div>
    </div>
  );
}
