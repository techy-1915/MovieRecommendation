import React, { useMemo } from 'react';

export default function SeatGrid({ seats, selectedSeats, onSeatToggle, pricePerSeat }) {
  const seatsByRow = useMemo(() => {
    const rows = {};
    (seats || []).forEach((seat) => {
      if (!rows[seat.rowNo]) rows[seat.rowNo] = [];
      rows[seat.rowNo].push(seat);
    });
    // Sort rows alphabetically and seats by number
    Object.keys(rows).forEach((row) => {
      rows[row].sort((a, b) => a.seatNumber - b.seatNumber);
    });
    return rows;
  }, [seats]);

  const getSeatColor = (seat) => {
    if (seat.isBooked) return 'bg-red-600 cursor-not-allowed opacity-70';
    if (selectedSeats.includes(seat.seatId)) return 'bg-yellow-400 text-gray-900 cursor-pointer';
    if (seat.seatType === 'PREMIUM') return 'bg-purple-700 hover:bg-purple-500 cursor-pointer';
    return 'bg-green-700 hover:bg-green-500 cursor-pointer';
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    onSeatToggle(seat.seatId);
  };

  const selectedCount = selectedSeats.length;
  const totalPrice = selectedCount * (pricePerSeat || 0);

  return (
    <div>
      {/* Screen indicator */}
      <div className="text-center mb-8">
        <div className="bg-gray-600 h-2 rounded-full max-w-xs mx-auto mb-1" />
        <p className="text-gray-400 text-xs">SCREEN</p>
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto">
        {Object.keys(seatsByRow).sort().map((row) => (
          <div key={row} className="flex items-center gap-1 mb-2 justify-center">
            <span className="text-gray-400 text-xs w-5 text-center">{row}</span>
            <div className="flex gap-1 flex-wrap justify-center">
              {seatsByRow[row].map((seat) => (
                <button
                  key={seat.seatId}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.isBooked}
                  title={`${seat.rowNo}${seat.seatNumber} - ${seat.seatType}`}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-green-700 rounded" />
          <span className="text-gray-400">Available (Normal)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-purple-700 rounded" />
          <span className="text-gray-400">Available (Premium)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-yellow-400 rounded" />
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-red-600 rounded opacity-70" />
          <span className="text-gray-400">Booked</span>
        </div>
      </div>

      {/* Summary */}
      {selectedCount > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-300 text-sm">
            {selectedCount} seat{selectedCount > 1 ? 's' : ''} selected
          </p>
          <p className="text-white text-2xl font-bold mt-1">₹{totalPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
