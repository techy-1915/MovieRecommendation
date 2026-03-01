import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeats } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from '../components/LoadingSpinner';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Number of seats the user wants to book (from previous screen)
  const desiredCount = parseInt(searchParams.get('seats') || '1', 10);

  const [pricePerSeat] = useState(200);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCurtain, setShowCurtain] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(`/booking/${showId}`)}`);
      return;
    }
    fetchSeats();
    // Curtain animation: 1.2s duration + 0.2s delay = 1.4s total
    const timer = setTimeout(() => setShowCurtain(false), 1400);
    return () => clearTimeout(timer);
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

  /**
   * Handles seat selection from SeatGrid.
   * - When SeatGrid finds an adjacent block it passes an array of seatIds.
   * - For individual toggles it passes a single seatId.
   */
  const handleSeatToggle = (seatIdOrBlock) => {
    if (Array.isArray(seatIdOrBlock)) {
      // Replace selection with the auto-selected adjacent block
      setSelectedSeats(seatIdOrBlock);
    } else {
      setSelectedSeats((prev) =>
        prev.includes(seatIdOrBlock)
          ? prev.filter((id) => id !== seatIdOrBlock)
          : [...prev, seatIdOrBlock]
      );
    }
    setError(null);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    if (selectedSeats.length !== desiredCount) {
      setError(`Please select exactly ${desiredCount} seat(s). You have selected ${selectedSeats.length}.`);
      return;
    }

    const seatLabels = selectedSeats.map((id) => {
      const seat = seats.find((s) => s.seatId === id);
      return seat ? `${seat.rowNo}${seat.seatNumber}` : id;
    });

    navigate(`/booking/${showId}/payment`, {
      state: { selectedSeats, seatLabels },
    });
  };

  const totalAmount = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* ── Red Curtain Animation on page load ───────────────────────────── */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
              className="w-1/2 h-full"
              style={{
                background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
                boxShadow: '4px 0 20px rgba(0,0,0,0.5)',
              }}
            />
            {/* Right curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
              className="w-1/2 h-full"
              style={{
                background: 'linear-gradient(to left, #7f1d1d, #dc2626)',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="glass-panel border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-neon-red text-xl transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">Show #{showId}</p>
          <p className="text-gray-500 text-xs">
            Select {desiredCount} seat{desiredCount !== 1 ? 's' : ''}
          </p>
        </div>
        <AnimatePresence>
          {selectedSeats.length > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 10px rgba(239,68,68,0.3)',
              }}
            >
              {selectedSeats.length} / {desiredCount} Ticket{desiredCount !== 1 ? 's' : ''}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3D Screen representation ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="pt-6 pb-2 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="relative mx-auto w-3/4 h-3 rounded-b-full mb-1"
            style={{
              background: 'linear-gradient(90deg, rgba(239,68,68,0.1), rgba(239,68,68,0.6), rgba(239,68,68,0.1))',
              boxShadow: '0 4px 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.2)',
            }}
          />
          <p className="text-center text-gray-600 text-xs uppercase tracking-widest">Screen</p>
        </div>
      </motion.div>

      {/* ── Auto-selection hint ───────────────────────────────────────────── */}
      {desiredCount > 1 && (
        <div className="max-w-2xl mx-auto px-4 pb-1">
          <p className="text-gray-500 text-xs text-center">
            💡 Tap any seat to auto-select {desiredCount} adjacent seats in the same row.
          </p>
        </div>
      )}

      {/* ── Seat grid area ───────────────────────────────────────────────── */}
      <div className="flex-1 py-4 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <FullPageLoader text="Loading seat layout..." />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <SeatGrid
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                pricePerSeat={pricePerSeat}
                desiredCount={desiredCount}
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 glass-panel border border-red-500/30 text-red-300 rounded-xl p-3 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Offer banner ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/5 px-4 py-2" style={{ background: 'rgba(26,26,26,0.8)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-gray-500">
          <span className="text-green-400">✅</span>
          <span>YES Private Debit Card Offer — Get 10% cashback</span>
        </div>
      </div>

      {/* ── Pay button (sticky bottom) ───────────────────────────────────── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
        className="glass-panel border-t border-white/5 px-4 py-4"
        style={{ boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="text-gray-300 text-sm">
            <span className="font-semibold text-white">{selectedSeats.length}</span> seat(s) ×{' '}
            ₹{pricePerSeat}
            {selectedSeats.length > 0 && (
              <motion.span
                key={totalAmount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2 text-neon-red font-bold"
              >
                = ₹{totalAmount}
              </motion.span>
            )}
          </div>
          <motion.button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
            whileHover={selectedSeats.length > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedSeats.length > 0 ? { scale: 0.98 } : {}}
            className="flex-1 sm:flex-none btn-neon disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-base sm:min-w-[180px]"
            style={selectedSeats.length > 0 ? {
              boxShadow: '0 0 30px rgba(239,68,68,0.5)',
            } : {}}
          >
            {selectedSeats.length > 0 ? `Pay ₹${totalAmount}` : 'Select Seats'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
