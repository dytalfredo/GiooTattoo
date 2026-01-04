import React, { useEffect, useState } from 'react';
import { LOADING, COMPANY } from '../constants';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Removed auto-dismiss logic to force user interaction for audio autoplay

  if (opacity === 0 && progress >= 100) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-opacity duration-1000"
      style={{ opacity: opacity / 100 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Main Text / Button */}
        {progress >= 100 ? (
          <button
            onClick={() => {
              setOpacity(0);
              setTimeout(onLoaded, 800);
            }}
            className="text-red-600 font-syncopate font-bold uppercase tracking-[0.3em] hover:text-white transition-colors animate-pulse text-xl md:text-2xl z-50 pointer-events-auto cursor-pointer"
          >
            {LOADING.button}
          </button>
        ) : (
          <h1 className="text-8xl md:text-[15vw] font-black font-syncopate tracking-tighter text-zinc-900 select-none animate-pulse uppercase">
            {COMPANY.name}
          </h1>
        )}

        {/* Percentage - Hide when ready */}
        {progress < 100 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
            <span className="text-red-600 font-mono text-xl md:text-2xl font-bold tracking-widest">
              {Math.min(progress, 100)}%
            </span>
          </div>
        )}
      </div>

      <div className={`absolute bottom-12 left-0 w-full px-12 flex flex-col justify-end items-center gap-4 transition-opacity duration-500 ${progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full flex justify-between items-end">
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">{LOADING.status}</span>
          <div className="w-24 h-[1px] bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Headphones Message */}
        <div className="animate-pulse flex items-center gap-2 text-zinc-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
          <span className="text-[8px] uppercase tracking-[0.2em] font-light">
            {LOADING.experience}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
