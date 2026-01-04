
import React, { useRef, useEffect, useState } from 'react';

import { PHILOSOPHY } from '../constants';

const PHRASES = PHILOSOPHY.phrases;

interface PhilosophyScrollProps {
  onInViewChange?: (inView: boolean) => void;
}

const PhilosophyScroll: React.FC<PhilosophyScrollProps> = ({ onInViewChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const start = top;
      const distance = height - viewportHeight;

      let pct = -start / distance;
      pct = Math.max(0, Math.min(1, pct));

      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to trigger meditative state
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (onInViewChange) {
          onInViewChange(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the massive container is visible
        rootMargin: "0px"
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [onInViewChange]);

  return (
    <div ref={containerRef} className="relative bg-[var(--bg-primary)] z-10 transition-colors duration-500" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Subtle Background Noise/Gradient - using var for color compatibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-primary)] opacity-50" />

        {/* Text Container that moves up based on scroll */}
        <div
          className="relative flex flex-col items-center gap-16 md:gap-20 lg:gap-24 transition-transform duration-75 ease-linear will-change-transform"
          style={{
            transform: `translateY(${50 - (progress * 120)}vh)` // Starts below center, moves up past center
          }}
        >
          {PHRASES.map((phrase, index) => {
            const phrasePos = index / (PHRASES.length - 1);
            const distFromFocus = Math.abs(progress - phrasePos);

            const isActive = distFromFocus < 0.15;
            const opacity = Math.max(0.1, 1 - (distFromFocus * 4));
            const blur = Math.max(0, (distFromFocus * 10));
            const scale = isActive ? 1.1 : 0.9;

            return (
              <div
                key={index}
                className="transition-all duration-500 ease-out flex flex-col items-center text-center px-4"
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `scale(${scale})`
                }}
              >
                {index === 3 && (
                  <span className="text-red-600 text-[10px] tracking-[0.5em] font-bold uppercase mb-4 block">
                    {PHILOSOPHY.label}
                  </span>
                )}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-syncopate tracking-tighter text-[var(--text-primary)] leading-none">
                  {phrase}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Static decorative elements - gradients must match theme bg */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
};

export default PhilosophyScroll;
