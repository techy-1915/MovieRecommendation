import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking } from '../services/api';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await getBooking(bookingId);
      setBooking(res.data);
    } catch (err) {
      setError('Could not load booking details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-400">
        Loading booking details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="text-red-400">{error}</div>
        <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-lg">
          Go Home
        </button>
      </div>
    );
  }

  const formatDateTime = (dt) => {
    if (!dt) return 'N/A';
    return new Date(dt).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="bg-card rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Booking Confirmed!</h1>
          <p className="text-gray-400 text-sm mt-1">Your tickets have been booked successfully</p>
        </div>

        {booking && (
          <div className="space-y-4">
            {/* Booking ID */}
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Booking ID</p>
              <p className="text-white text-xl font-bold mt-1">#{booking.bookingId}</p>
            </div>

            <div className="border border-gray-700 rounded-xl divide-y divide-gray-700">
              {booking.show?.movie && (
                <div className="p-4 flex justify-between">
                  <span className="text-gray-400 text-sm">Movie</span>
                  <span className="text-white text-sm font-medium">{booking.show.movie.title}</span>
                </div>
              )}
              {booking.show?.showTime && (
                <div className="p-4 flex justify-between">
                  <span className="text-gray-400 text-sm">Show Time</span>
                  <span className="text-white text-sm font-medium">{formatDateTime(booking.show.showTime)}</span>
                </div>
              )}
              {booking.show?.screen?.theatre && (
                <>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-400 text-sm">Theatre</span>
                    <span className="text-white text-sm font-medium">{booking.show.screen.theatre.theatreName}</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-400 text-sm">Screen</span>
                    <span className="text-white text-sm font-medium">{booking.show.screen.screenName}</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-400 text-sm">City</span>
                    <span className="text-white text-sm font-medium">{booking.show.screen.theatre.city}</span>
                  </div>
                </>
              )}
              <div className="p-4 flex justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <span className={`text-sm font-bold ${booking.status === 'CONFIRMED' ? 'text-green-400' : 'text-red-400'}`}>
                  {booking.status}
                </span>
              </div>
              {booking.totalAmount && (
                <div className="p-4 flex justify-between bg-primary/10">
                  <span className="text-gray-300 font-semibold">Total Amount</span>
                  <span className="text-white font-bold text-lg">₹{booking.totalAmount}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Book More
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Download Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
