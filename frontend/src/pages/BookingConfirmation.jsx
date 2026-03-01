import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooking } from '../services/api';
import { FullPageLoader } from '../components/LoadingSpinner';
import GlassButton from '../components/GlassButton';

// Confetti particle component
function ConfettiParticle({ index }) {
  const colors = ['#ef4444', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
  const color = colors[index % colors.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.8;
  const duration = 1.5 + Math.random() * 1;
  const size = 6 + Math.random() * 6;

  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', opacity: 0, rotate: 720 }}
      transition={{ duration, delay, ease: 'easeIn' }}
      className="fixed top-0 pointer-events-none z-50 rounded-sm"
      style={{ width: size, height: size, background: color }}
    />
  );
}

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || 'UPI';
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    fetchBooking();
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
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
    return <FullPageLoader text="Loading booking details..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="text-red-400">{error}</div>
        <GlassButton onClick={() => navigate('/')} variant="primary">Go Home</GlassButton>
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

  const qrData = `BOOKING:${bookingId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  const handleShareWhatsApp = () => {
    const text = `🎬 Booking Confirmed!\nMovie: ${booking?.movieTitle}\nTheatre: ${booking?.theatreName}\nSeats: ${booking?.seats?.join(', ')}\nBooking ID: #${bookingId}\nAmount: ₹${booking?.totalAmount}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center px-4 py-12"
      style={{ background: '#0a0a0a' }}
    >
      {/* Confetti explosion */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {Array.from({ length: 40 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Success header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="text-center mb-8"
        >
          {/* Animated checkmark */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'rgba(34,197,94,0.2)',
              border: '2px solid rgba(34,197,94,0.5)',
              boxShadow: '0 0 30px rgba(34,197,94,0.4)',
            }}
          >
            <motion.svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#22c55e"
              strokeWidth={2.5}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.svg>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-3xl font-bold text-white"
          >
            Booking Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-400 text-sm mt-2"
          >
            Your tickets have been booked successfully
          </motion.p>
        </motion.div>

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {/* Ticket design */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(45,45,45,0.9))',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              {/* Top ticket section */}
              <div className="p-5">
                {/* Booking ID */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Booking ID</p>
                    <p className="text-white text-xl font-bold mt-0.5">#{booking.bookingId}</p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={booking.status === 'CONFIRMED' ? {
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.4)',
                      color: '#22c55e',
                      boxShadow: '0 0 10px rgba(34,197,94,0.2)',
                    } : {
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      color: '#ef4444',
                    }}
                  >
                    {booking.status}
                  </div>
                </div>

                {/* Movie info */}
                <div className="flex gap-4">
                  {booking.moviePoster && (
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      className="w-16 h-24 object-cover rounded-xl flex-shrink-0"
                      style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-white font-bold text-lg leading-tight">{booking.movieTitle}</p>
                    <p className="text-gray-400 text-sm">{booking.theatreName}</p>
                    <p className="text-gray-500 text-xs">{booking.screenName}</p>
                    <p className="text-gray-400 text-sm">{formatDateTime(booking.showTime)}</p>
                  </div>
                </div>
              </div>

              {/* Tear-line separator */}
              <div className="relative flex items-center px-0 my-0">
                <div
                  className="w-full border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', borderStyle: 'dashed' }}
                />
                <div className="absolute left-0 w-4 h-8 rounded-r-full" style={{ background: '#0a0a0a' }} />
                <div className="absolute right-0 w-4 h-8 rounded-l-full" style={{ background: '#0a0a0a' }} />
              </div>

              {/* Bottom ticket section */}
              <div className="p-5 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  {booking.seats?.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs">Seats</p>
                      <p className="text-white text-sm font-semibold">{booking.seats.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-xs">Tickets</p>
                    <p className="text-white text-sm font-semibold">{booking.seats?.length || 1}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Payment</p>
                    <p className="text-white text-sm font-semibold">{paymentMethod}</p>
                  </div>
                  {booking.totalAmount && (
                    <div>
                      <p className="text-gray-500 text-xs">Amount Paid</p>
                      <p className="text-neon-gold text-sm font-bold">₹{booking.totalAmount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center glass-panel rounded-2xl p-5 border border-white/5"
            >
              <div className="rounded-xl overflow-hidden p-3 bg-white">
                <img
                  src={qrUrl}
                  alt="Ticket QR Code"
                  className="w-44 h-44"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-3 text-center">Show this QR code at the entrance</p>
            </motion.div>

            {/* Instructions */}
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
              }}
            >
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide mb-2">Important Instructions</p>
              <ul className="text-gray-400 text-sm space-y-1.5">
                <li>📋 Show this ticket at the entrance</li>
                <li>⏰ Arrive 15 minutes before showtime</li>
                <li>🍿 Food and beverages available at counter</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <GlassButton
                onClick={() => window.print()}
                variant="primary"
                size="sm"
                className="justify-center"
              >
                📥 Download
              </GlassButton>
              <GlassButton
                onClick={handleShareWhatsApp}
                variant="secondary"
                size="sm"
                className="justify-center"
              >
                📱 WhatsApp
              </GlassButton>
              <GlassButton
                onClick={() => {
                  const event = {
                    text: `${booking.movieTitle} at ${booking.theatreName}`,
                    dates: new Date(booking.showTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                  };
                  window.open(`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(event.text)}&dates=${event.dates}/${event.dates}`, '_blank');
                }}
                variant="secondary"
                size="sm"
                className="justify-center"
              >
                📅 Calendar
              </GlassButton>
              <GlassButton
                onClick={() => navigate('/my-bookings')}
                variant="ghost"
                size="sm"
                className="justify-center"
              >
                🎫 My Bookings
              </GlassButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
