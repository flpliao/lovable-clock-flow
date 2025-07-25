import React from 'react';

export interface LazyLoadingSpinnerProps {
  className?: string;
}

const LazyLoadingSpinner: React.FC<LazyLoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center ${className}`}
    >
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">載入頁面內容...</p>
      </div>
    </div>
  );
};

export default LazyLoadingSpinner;
