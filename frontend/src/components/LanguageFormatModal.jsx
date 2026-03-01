import React, { useState } from 'react';

const DEFAULT_FORMATS = ['2D', 'IMAX 2D', '4DX', '4DX 3D', 'ICE', 'MX4D', '2D SCREEN X'];

export default function LanguageFormatModal({
  movieTitle,
  languages = [],
  onSelect,
  onClose,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0] || '');
  const [selectedFormat, setSelectedFormat] = useState('2D');

  const handleConfirm = () => {
    onSelect({ language: selectedLanguage, format: selectedFormat });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full mx-4 rounded-2xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 pr-8">{movieTitle}</h2>
        <p className="text-gray-500 text-sm mt-1 mb-5">
          Select language and format
        </p>

        {/* Language */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Language
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedLanguage === lang
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Format */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Format
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {DEFAULT_FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedFormat === fmt
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          See Showtimes
        </button>
      </div>
    </div>
  );
}
