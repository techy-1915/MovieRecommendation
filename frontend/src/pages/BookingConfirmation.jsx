import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBooking } from '../services/api';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || 'UPI';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const qrData = `BOOKING:${bookingId}|MOVIE:${booking?.movieTitle}|SEATS:${booking?.seats?.join(',')}|AMOUNT:${booking?.totalAmount}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  const handleShareWhatsApp = () => {
    const text = `🎬 Booking Confirmed!\nMovie: ${booking?.movieTitle}\nTheatre: ${booking?.theatreName}\nSeats: ${booking?.seats?.join(', ')}\nBooking ID: #${bookingId}\nAmount: ₹${booking?.totalAmount}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-2xl">
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

            {/* QR Code */}
            <div className="flex flex-col items-center bg-white rounded-xl p-4">
              <img
                src={qrUrl}
                alt="Ticket QR Code"
                className="w-48 h-48"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p className="text-gray-600 text-xs mt-2">Show this QR at the entrance</p>
            </div>

            {/* Movie info with poster */}
            <div className="flex gap-3 bg-gray-800 rounded-xl p-4">
              {booking.moviePoster && (
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-1">
                <p className="text-white font-bold">{booking.movieTitle}</p>
                <p className="text-gray-400 text-sm">{booking.theatreName}</p>
                <p className="text-gray-400 text-sm">{booking.screenName}</p>
                <p className="text-gray-400 text-sm">{formatDateTime(booking.showTime)}</p>
              </div>
            </div>

            {/* Booking details */}
            <div className="border border-gray-700 rounded-xl divide-y divide-gray-700">
              {booking.seats && booking.seats.length > 0 && (
                <div className="p-4 flex justify-between">
                  <span className="text-gray-400 text-sm">Seats</span>
                  <span className="text-white text-sm font-medium">{booking.seats.join(', ')}</span>
                </div>
              )}
              <div className="p-4 flex justify-between">
                <span className="text-gray-400 text-sm">Tickets</span>
                <span className="text-white text-sm font-medium">{booking.seats?.length || 1} Ticket{booking.seats?.length > 1 ? 's' : ''}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-gray-400 text-sm">Payment Method</span>
                <span className="text-white text-sm font-medium">{paymentMethod}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <span className={`text-sm font-bold ${booking.status === 'CONFIRMED' ? 'text-green-400' : 'text-red-400'}`}>
                  {booking.status}
                </span>
              </div>
              {booking.totalAmount && (
                <div className="p-4 flex justify-between bg-primary/10">
                  <span className="text-gray-300 font-semibold">Amount Paid</span>
                  <span className="text-white font-bold text-lg">₹{booking.totalAmount}</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide mb-2">Important Instructions</p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>📋 Show this ticket at the entrance</li>
                <li>⏰ Arrive 15 minutes before showtime</li>
                <li>🍿 Food and beverages available at counter</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="bg-primary hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                📥 Download Ticket
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                📱 Share via WhatsApp
              </button>
              <button
                onClick={() => {
                  const event = {
                    text: `${booking.movieTitle} at ${booking.theatreName}`,
                    dates: new Date(booking.showTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                  };
                  window.open(`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(event.text)}&dates=${event.dates}/${event.dates}`, '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                📅 Add to Calendar
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                🎫 My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

