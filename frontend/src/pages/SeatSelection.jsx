import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeats, createBooking } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import { useAuth } from '../context/AuthContext';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pricePerSeat] = useState(200);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(`/booking/${showId}`)}`);
      return;
    }
    fetchSeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const res = await getSeats(showId);
      setSeats(res.data);
    } catch (err) {
      setError('Failed to load seat layout.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setBooking(true);
    setError(null);
    try {
      const totalAmount = selectedSeats.length * pricePerSeat;
      const res = await createBooking({
        userId: user.userId,
        showId: parseInt(showId),
        seatIds: selectedSeats,
        totalAmount,
      });
      navigate(`/booking/confirm/${res.data.bookingId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const totalAmount = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white text-xl transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">Show #{showId}</p>
          <p className="text-gray-500 text-xs">Select your seats</p>
        </div>
        {selectedSeats.length > 0 && (
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Seat grid area */}
      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-16 text-gray-400">Loading seat layout...</div>
          ) : (
            <>
              <SeatGrid
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                pricePerSeat={pricePerSeat}
              />

              {error && (
                <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Offer banner */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <span className="text-green-500">✅</span>
          <span>YES Private Debit Card Offer — Get 10% cashback</span>
        </div>
      </div>

      {/* Pay button */}
      <div className="bg-card border-t border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="text-gray-300 text-sm">
            <span className="font-semibold text-white">{selectedSeats.length}</span> seat(s) ×{' '}
            ₹{pricePerSeat}
          </div>
          <button
            onClick={handleProceed}
            disabled={booking || selectedSeats.length === 0}
            className="flex-1 sm:flex-none bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-base transition-colors sm:min-w-[180px]"
          >
            {booking
              ? 'Booking...'
              : selectedSeats.length > 0
              ? `Pay ₹ ${totalAmount}`
              : 'Select Seats'}
          </button>
        </div>
      </div>
    </div>
  );
}
