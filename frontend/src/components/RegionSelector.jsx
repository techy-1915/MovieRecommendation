import React from 'react';

const REGIONS = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
];

export default function RegionSelector({ selectedRegion, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm">🌍 Region:</span>
      <select
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-primary"
      >
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
