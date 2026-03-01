import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getShowDetails, processPayment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SuccessAnimation from '../components/SuccessAnimation';
import { FullPageLoader } from '../components/LoadingSpinner';
import GlassButton from '../components/GlassButton';

const CONVENIENCE_FEE_PER_TICKET = 23.60;
const GST_RATE = 0.18;

function calcPricing(price, count) {
  const baseAmount = price * count;
  const convenienceFee = +(CONVENIENCE_FEE_PER_TICKET * count).toFixed(2);
  const subTotal = +(baseAmount + convenienceFee).toFixed(2);
  const gst = +(subTotal * GST_RATE).toFixed(2);
  const totalAmount = +(subTotal + gst).toFixed(2);
  return { baseAmount, convenienceFee, subTotal, gst, totalAmount };
}

const UPI_OPTIONS = [
  { id: 'bhim', label: 'BHIM UPI', icon: '🏛️' },
  { id: 'phonepe', label: 'PhonePe', icon: '💜' },
  { id: 'gpay', label: 'Google Pay', icon: '🟢' },
  { id: 'paytm', label: 'Paytm', icon: '🔵' },
  { id: 'amazon', label: 'Amazon Pay', icon: '🟠' },
];

const WALLET_OPTIONS = [
  { id: 'paytm_wallet', label: 'Paytm Wallet' },
  { id: 'mobikwik', label: 'Mobikwik' },
  { id: 'freecharge', label: 'Freecharge' },
  { id: 'airtel', label: 'Airtel Money' },
  { id: 'jio', label: 'JioMoney' },
];

const BANK_OPTIONS = [
  'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank',
  'Kotak Mahindra Bank', 'Yes Bank', 'Punjab National Bank', 'Bank of Baroda',
];

const TABS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'wallet', label: 'Wallets', icon: '👜' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'voucher', label: 'Voucher', icon: '🎁' },
];

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
};

export default function PaymentSummary() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { selectedSeats = [], seatLabels = [] } = location.state || {};

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upi');
  const [selectedUpi, setSelectedUpi] = useState('bhim');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('paytm_wallet');
  const [selectedBank, setSelectedBank] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [offerChecked, setOfferChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successBookingId, setSuccessBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    if (!selectedSeats.length) {
      navigate(`/booking/${showId}`);
      return;
    }
    getShowDetails(showId)
      .then((res) => setShow(res.data))
      .catch(() => setError('Could not load show details.'))
      .finally(() => setLoading(false));
  }, [showId, selectedSeats.length, navigate]);

  const pricing = show
    ? calcPricing(parseFloat(show.price), selectedSeats.length)
    : null;

  const getPaymentMethodLabel = () => {
    switch (activeTab) {
      case 'upi': return upiId ? `UPI - ${upiId}` : `UPI - ${selectedUpi.toUpperCase()}`;
      case 'card': return `Card - ${cardNumber ? `XXXX-${cardNumber.slice(-4)}` : 'Card'}`;
      case 'wallet': return `Wallet - ${selectedWallet}`;
      case 'netbanking': return `NetBanking - ${selectedBank || 'Bank'}`;
      case 'voucher': return 'Gift Voucher';
      default: return 'UPI';
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const method = getPaymentMethodLabel();
      setPaymentMethod(method);
      const res = await processPayment({
        userId: user.userId,
        showId: parseInt(showId),
        seatIds: selectedSeats,
        totalAmount: pricing.totalAmount,
        paymentMethod: method,
      });
      setSuccessBookingId(res.data.bookingId);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    navigate(`/booking/confirm/${successBookingId}`, {
      state: { paymentMethod },
    });
  }, [navigate, successBookingId, paymentMethod]);

  const formatDateTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <FullPageLoader text="Loading payment details..." />;
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      {successBookingId && (
        <SuccessAnimation bookingId={successBookingId} onComplete={handleAnimationComplete} />
      )}

      {/* Header */}
      <div className="glass-panel border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-neon-red text-xl transition-colors">←</button>
        <h1 className="text-white font-semibold text-base">Payment Summary</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-32">

        {/* Movie info */}
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-4 flex gap-4 items-start border border-white/5"
          >
            {show.moviePoster && (
              <img
                src={show.moviePoster}
                alt={show.movieTitle}
                className="w-16 h-24 object-cover rounded-xl flex-shrink-0"
                style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
              />
            )}
            <div>
              <h2 className="text-white font-bold text-lg">{show.movieTitle}</h2>
              <p className="text-gray-400 text-sm mt-1">{show.theatreName}</p>
              <p className="text-gray-500 text-xs">{show.screenName}</p>
              <p className="text-gray-400 text-sm">{formatDateTime(show.showTime)}</p>
              <p className="text-gray-300 text-sm mt-1 font-medium">
                {seatLabels.join(', ')} &nbsp;·&nbsp; {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}

        {/* Price Breakdown */}
        {pricing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-4 border border-white/5"
          >
            <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider text-gray-400">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Base Amount ({selectedSeats.length} × ₹{show?.price})</span>
                <span>₹ {pricing.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Convenience Fee</span>
                <span>₹ {pricing.convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 border-t border-white/5 pt-2">
                <span>Sub Total</span>
                <span>₹ {pricing.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST (18%)</span>
                <span>₹ {pricing.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-white/10 pt-2 mt-1">
                <span>Total Amount</span>
                <span className="text-neon-gold" style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>
                  ₹ {pricing.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Offer Banner */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={offerChecked}
              onChange={(e) => setOfferChecked(e.target.checked)}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-green-400 text-sm">
              YES Private Debit Card Offer — Get 10% cashback up to ₹200
            </span>
          </label>
        </div>

        {/* Coupon Code */}
        <div className="glass-panel rounded-xl p-4 border border-white/5">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Apply Coupon</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none"
              style={inputStyle}
            />
            <GlassButton variant="primary" size="sm">Apply</GlassButton>
          </div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl overflow-hidden border border-white/5"
        >
          <h3 className="text-white font-semibold p-4 text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
            Payment Method
          </h3>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-white/5 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-neon-red border-b-2 border-neon-red'
                    : 'text-gray-500 hover:text-gray-300'}`}
                style={activeTab === tab.id ? { background: 'rgba(239,68,68,0.05)' } : {}}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-2">
                {UPI_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
                      selectedUpi === opt.id && !upiId
                        ? 'border border-neon-red/30'
                        : 'border border-transparent hover:border-white/5'
                    }`}
                    style={selectedUpi === opt.id && !upiId ? { background: 'rgba(239,68,68,0.05)' } : { background: 'rgba(255,255,255,0.02)' }}
                  >
                    <input
                      type="radio"
                      name="upi"
                      value={opt.id}
                      checked={selectedUpi === opt.id && !upiId}
                      onChange={() => { setSelectedUpi(opt.id); setUpiId(''); }}
                      className="accent-red-500"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-gray-200 text-sm">{opt.label}</span>
                  </label>
                ))}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-gray-500 text-xs mb-2">Or enter UPI ID manually</p>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setSelectedUpi(''); }}
                    className="w-full rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Card Tab */}
            {activeTab === 'card' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  maxLength={16}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                  style={inputStyle}
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    maxLength={5}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                      setCardExpiry(v);
                    }}
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCvv}
                    maxLength={4}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                  style={inputStyle}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="accent-red-500"
                  />
                  <span className="text-gray-500 text-sm">Save card for future payments</span>
                </label>
              </div>
            )}

            {/* Wallets Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-2">
                {WALLET_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <input
                      type="radio"
                      name="wallet"
                      value={opt.id}
                      checked={selectedWallet === opt.id}
                      onChange={() => setSelectedWallet(opt.id)}
                      className="accent-red-500"
                    />
                    <span className="text-gray-200 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Net Banking Tab */}
            {activeTab === 'netbanking' && (
              <div>
                <p className="text-gray-500 text-xs mb-3">Select your bank</p>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={inputStyle}
                >
                  <option value="">-- Select Bank --</option>
                  {BANK_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Voucher Tab */}
            {activeTab === 'voucher' && (
              <div>
                <p className="text-gray-500 text-xs mb-3">Enter gift voucher code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none"
                    style={inputStyle}
                  />
                  <GlassButton variant="primary" size="sm">Apply</GlassButton>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-3 text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Proceed to Pay sticky button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/5 px-4 py-4 z-20"
        style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="max-w-xl mx-auto">
          <motion.button
            onClick={handlePay}
            disabled={processing}
            whileHover={!processing ? { scale: 1.02 } : {}}
            whileTap={!processing ? { scale: 0.98 } : {}}
            className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base"
            style={!processing ? {
              boxShadow: '0 0 30px rgba(239,68,68,0.5)',
            } : {}}
          >
            {processing
              ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing payment...
                </span>
              )
              : `Proceed to Pay ₹ ${pricing ? pricing.totalAmount.toFixed(2) : '0.00'}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
