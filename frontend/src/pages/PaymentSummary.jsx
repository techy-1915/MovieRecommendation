import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getShowDetails, processPayment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SuccessAnimation from '../components/SuccessAnimation';

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
    // Simulate 2 second gateway delay
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

  const TABS = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'wallet', label: 'Wallets' },
    { id: 'netbanking', label: 'Net Banking' },
    { id: 'voucher', label: 'Voucher' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {successBookingId && (
        <SuccessAnimation bookingId={successBookingId} onComplete={handleAnimationComplete} />
      )}

      {/* Header */}
      <div className="bg-card border-b border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl transition-colors">←</button>
        <h1 className="text-white font-semibold text-base">Payment Summary</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-32">

        {/* Movie info */}
        {show && (
          <div className="bg-card rounded-xl p-4 flex gap-4 items-start">
            {show.moviePoster && (
              <img src={show.moviePoster} alt={show.movieTitle} className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
            )}
            <div>
              <h2 className="text-white font-bold text-lg">{show.movieTitle}</h2>
              <p className="text-gray-400 text-sm mt-1">{show.theatreName}</p>
              <p className="text-gray-400 text-sm">{show.screenName}</p>
              <p className="text-gray-400 text-sm">{formatDateTime(show.showTime)}</p>
              <p className="text-gray-300 text-sm mt-1 font-medium">
                {seatLabels.join(', ')} &nbsp;·&nbsp; {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        {pricing && (
          <div className="bg-card rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Base Amount ({selectedSeats.length} × ₹{show?.price})</span>
                <span>₹ {pricing.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Convenience Fee (₹{CONVENIENCE_FEE_PER_TICKET} × {selectedSeats.length})</span>
                <span>₹ {pricing.convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300 border-t border-gray-700 pt-2">
                <span>Sub Total</span>
                <span>₹ {pricing.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>GST (18%)</span>
                <span>₹ {pricing.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-gray-600 pt-2 mt-1">
                <span>Total Amount</span>
                <span>₹ {pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Offer Banner */}
        <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={offerChecked}
              onChange={(e) => setOfferChecked(e.target.checked)}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-green-300 text-sm">
              YES Private Debit Card Offer — Get 10% cashback up to ₹200
            </span>
          </label>
        </div>

        {/* Coupon Code */}
        <div className="bg-card rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Apply Coupon</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card rounded-xl overflow-hidden">
          <h3 className="text-white font-semibold p-4 text-sm uppercase tracking-wide border-b border-gray-800">
            Payment Method
          </h3>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-400 hover:text-gray-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-3">
                {UPI_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <input
                      type="radio"
                      name="upi"
                      value={opt.id}
                      checked={selectedUpi === opt.id}
                      onChange={() => { setSelectedUpi(opt.id); setUpiId(''); }}
                      className="accent-primary"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-gray-200 text-sm">{opt.label}</span>
                  </label>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-gray-400 text-xs mb-2">Or enter UPI ID manually</p>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setSelectedUpi(''); }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
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
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCvv}
                    maxLength={4}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="text-gray-400 text-sm">Save card for future payments</span>
                </label>
              </div>
            )}

            {/* Wallets Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-2">
                {WALLET_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <input
                      type="radio"
                      name="wallet"
                      value={opt.id}
                      checked={selectedWallet === opt.id}
                      onChange={() => setSelectedWallet(opt.id)}
                      className="accent-primary"
                    />
                    <span className="text-gray-200 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Net Banking Tab */}
            {activeTab === 'netbanking' && (
              <div>
                <p className="text-gray-400 text-xs mb-3">Select your bank</p>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
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
                <p className="text-gray-400 text-xs mb-3">Enter gift voucher code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Proceed to Pay sticky button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-800 px-4 py-3 z-20">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base transition-colors"
          >
            {processing
              ? 'Processing payment...'
              : `Proceed to Pay ₹ ${pricing ? pricing.totalAmount.toFixed(2) : '0.00'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
