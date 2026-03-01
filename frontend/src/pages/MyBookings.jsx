import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PLACEHOLDER_POSTER } from '../services/api';

export default function MyBookings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/my-bookings');
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserBookings(user.userId);
      // Sort newest first
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setBookings(sorted);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const isFutureShow = (showTime) => {
    return new Date(showTime) > new Date();
  };

  const formatDateTime = (dt) => {
    if (!dt) return 'N/A';
    return new Date(dt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-400">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-gray-400 mb-8">Your complete booking history</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎟️</div>
            <p className="text-gray-400 text-lg mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4 border border-gray-800"
              >
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={booking.moviePoster || PLACEHOLDER_POSTER}
                    alt={booking.movieTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                    onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-white font-bold text-lg line-clamp-1">
                      {booking.movieTitle}
                    </h2>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-400 mb-3">
                    <span>🏛️ {booking.theatreName}</span>
                    <span>📽️ {booking.screenName}</span>
                    <span>🕐 {formatDateTime(booking.showTime)}</span>
                    <span>📅 Booked: {formatDateTime(booking.bookingDate)}</span>
                  </div>

                  {booking.seats && booking.seats.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {booking.seats.map((seat) => (
                        <span
                          key={seat}
                          className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold text-lg">
                      ₹{booking.totalAmount}
                    </span>
                    {booking.status === 'CONFIRMED' && isFutureShow(booking.showTime) && (
                      <button
                        onClick={() => handleCancel(booking.bookingId)}
                        disabled={cancelling === booking.bookingId}
                        className="bg-red-900/40 hover:bg-red-900/70 disabled:opacity-50 text-red-400 text-sm px-4 py-2 rounded-lg transition-colors border border-red-800"
                      >
                        {cancelling === booking.bookingId ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
