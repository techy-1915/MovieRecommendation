import React, { useMemo } from 'react';

// Map backend seatType to display category
function getCategoryLabel(seatType) {
  if (!seatType) return 'STANDARD';
  const t = seatType.toUpperCase();
  if (t === 'PREMIUM') return 'GOLD';
  return 'STANDARD';
}

const CATEGORY_ORDER = ['GOLD', 'STANDARD'];
const CATEGORY_PRICE = { GOLD: 350, STANDARD: 200 };

export default function SeatGrid({ seats, selectedSeats, onSeatToggle, pricePerSeat }) {
  // Group seats by category, then by row
  const categories = useMemo(() => {
    const catMap = {};
    (seats || []).forEach((seat) => {
      const cat = getCategoryLabel(seat.seatType);
      if (!catMap[cat]) catMap[cat] = {};
      if (!catMap[cat][seat.rowNo]) catMap[cat][seat.rowNo] = [];
      catMap[cat][seat.rowNo].push(seat);
    });
    // Sort seats within rows
    Object.keys(catMap).forEach((cat) => {
      Object.keys(catMap[cat]).forEach((row) => {
        catMap[cat][row].sort((a, b) => a.seatNumber - b.seatNumber);
      });
    });
    return catMap;
  }, [seats]);

  const getSeatClasses = (seat) => {
    if (seat.isBooked) {
      return 'bg-gray-600 border-gray-500 text-gray-500 cursor-not-allowed';
    }
    if (selectedSeats.includes(seat.seatId)) {
      return 'bg-green-600 border-green-500 text-white cursor-pointer';
    }
    return 'bg-transparent border-green-600 text-green-400 cursor-pointer hover:bg-green-900/30';
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    onSeatToggle(seat.seatId);
  };

  const selectedCount = selectedSeats.length;
  const totalPrice = selectedCount * (pricePerSeat || 200);

  return (
    <div>
      {/* Seat grid by category */}
      <div className="space-y-8">
        {CATEGORY_ORDER.filter((cat) => categories[cat]).map((cat) => {
          const rows = categories[cat];
          const price = CATEGORY_PRICE[cat] || pricePerSeat;
          return (
            <div key={cat}>
              {/* Category header */}
              <div className="text-center mb-4">
                <span className="bg-gray-800 text-gray-300 text-xs font-bold px-4 py-1.5 rounded-full border border-gray-700">
                  ₹{price} {cat}
                </span>
              </div>
              {/* Rows */}
              <div className="space-y-2">
                {Object.keys(rows).sort().map((rowKey) => (
                  <div key={rowKey} className="flex items-center gap-2 justify-center">
                    <span className="text-gray-500 text-xs w-5 text-right flex-shrink-0">{rowKey}</span>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {rows[rowKey].map((seat) => (
                        <button
                          key={seat.seatId}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.isBooked}
                          title={`${seat.rowNo}${seat.seatNumber} — ${seat.isBooked ? 'Sold' : 'Available'}`}
                          className={`w-7 h-7 rounded text-xs font-medium border transition-colors ${getSeatClasses(seat)}`}
                        >
                          {seat.seatNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen indicator */}
      <div className="mt-10 text-center">
        <div className="mx-auto max-w-xs">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80"
            style={{ boxShadow: '0 0 12px 4px rgba(96,165,250,0.4)' }}
          />
          <p className="text-gray-500 text-xs mt-2">All eyes this way please</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-5 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-green-600 bg-transparent" />
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-green-500 bg-green-600" />
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-gray-500 bg-gray-600" />
          <span className="text-gray-400">Sold</span>
        </div>
      </div>

      {/* Summary */}
      {selectedCount > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
          <p className="text-gray-400 text-sm">
            {selectedCount} seat{selectedCount > 1 ? 's' : ''} selected
          </p>
          <p className="text-white text-2xl font-bold mt-1">₹{totalPrice}</p>
        </div>
      )}
    </div>
  );
}
