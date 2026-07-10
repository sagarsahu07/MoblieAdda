import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center space-y-4 bg-dark-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800/80"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-500 animate-spin"></div>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading Mobile Adda Showcase...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-800/80"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
