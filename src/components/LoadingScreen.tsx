
import React, { useEffect, useState } from 'react';
import { ARTIST_NAME } from '../constants';

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

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setOpacity(0);
        setTimeout(onLoaded, 800); // Wait for fade out
      }, 500);
    }
  }, [progress, onLoaded]);

  if (opacity === 0 && progress >= 100) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-opacity duration-1000"
      style={{ opacity: opacity / 100 }}
    >
      <div className="relative">
        <h1 className="text-8xl md:text-[15vw] font-black font-syncopate tracking-tighter text-zinc-900 select-none animate-pulse">
          {ARTIST_NAME}
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <span className="text-red-600 font-mono text-xl md:text-2xl font-bold tracking-widest">
            {Math.min(progress, 100)}%
          </span>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 w-full px-12 flex flex-col justify-end items-center gap-4">
        <div className="w-full flex justify-between items-end">
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">Cargando Archivos</span>
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
             Use Headphones for Immersion
           </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
