import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeats, createBooking } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import { useAuth } from '../context/AuthContext';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [pricePerSeat] = useState(200); // default; ideally passed from show

  useEffect(() => {
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
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
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

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Select Seats</h1>
          <p className="text-gray-400 mt-1">Show #{showId}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">Loading seat layout...</div>
        ) : (
          <div className="bg-card rounded-2xl p-6">
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

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-300">
                <span className="font-semibold text-white">{selectedSeats.length}</span> seat(s) selected
                {selectedSeats.length > 0 && (
                  <span className="ml-2 text-green-400 font-bold">
                    • Total: ₹{(selectedSeats.length * pricePerSeat).toFixed(2)}
                  </span>
                )}
              </div>
              <button
                onClick={handleProceed}
                disabled={booking || selectedSeats.length === 0}
                className="bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
              >
                {booking ? 'Booking...' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
