import React, { useState, useEffect } from 'react';
import { HERO, COMPANY, MEDIA } from '../constants';
import DustySpotlight from './DustySpotlight';

interface HeroProps {
  theme: 'dark' | 'light';
}

const Hero: React.FC<HeroProps> = ({ theme }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isLight = theme === 'light';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">

      {/* 
        THE SPOTLIGHT 
        Now lives strictly inside the Hero section. 
        It will scroll away naturally as the user moves down.
      */}
      <DustySpotlight theme={theme} />

      {/* Background Glow (Red Accent) - kept distinct from the white spotlight */}
      <div
        className="absolute w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />

      {/* Main Interactive Container */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-4 md:gap-16 select-none max-w-full px-4">

        {/* Text Side */}
        <div className="text-left flex flex-col items-start">
          {/* Small Label Typography */}
          <div
            className="mb-2 md:mb-6 transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`
            }}
          >
            <span className="text-[8px] md:text-[10px] tracking-[0.5em] text-[var(--text-secondary)] uppercase font-bold block mb-1 md:mb-2">{HERO.label}</span>
            <span className="text-[10px] md:text-xs text-[var(--text-primary)] opacity-40 block">{HERO.archiveCode}</span>
          </div>

          {/* Main Interactive Name */}
          <div className="relative">
            <h1
              className="text-[15vw] md:text-[18vw] leading-none font-black font-syncopate tracking-tighter text-[var(--text-primary)] transition-transform duration-75 flex items-center justify-center"
              style={{
                transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
              }}
            >
              {/* LETTER G */}
              <span
                className={isLight ? "animate-red-flash" : ""}
                style={{ animationDelay: isLight ? '0s' : '0s' }}
              >
                G
              </span>

              {/* LETTER I (Special behavior) */}
              <span className="relative mx-[-1vw]">
                {/* 
                   Volumetric Glow behind the I:
                   Only visible in DARK mode to create the "light bulb" effect.
                */}
                {!isLight && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[60px] animate-ambient-glow pointer-events-none z-[-1] mix-blend-screen" />
                )}

                {/* 
                   The Letter I itself:
                   - Dark Mode: animate-glitch-light (White broken bulb flicker)
                   - Light Mode: animate-red-flash (Red sequential flash with delay)
                */}
                <span
                  className={`relative z-10 inline-block ${isLight ? 'animate-red-flash' : 'animate-glitch-light'}`}
                  style={{ animationDelay: isLight ? '0.2s' : '0s' }} // Slight delay for sequence
                >
                  I
                </span>
              </span>

              {/* LETTER O */}
              <span
                className={isLight ? "animate-red-flash" : ""}
                style={{ animationDelay: isLight ? '0.4s' : '0s' }} // More delay for sequence
              >
                O
              </span>
            </h1>

            {/* Parallax Tagline */}
            <div
              className="mt-[-1vw] flex justify-start"
              style={{
                transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`
              }}
            >
              <span className="text-red-600 text-[1.2vw] md:text-[0.7vw] tracking-[1.5em] font-bold uppercase pl-[1em]">
                {COMPANY.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Video Frame Container */}
        <div
          className="relative w-24 h-44 md:w-56 md:h-[400px] overflow-hidden rounded-lg md:rounded-xl border border-[var(--border-color)] bg-black shadow-2xl transition-transform duration-100 ease-out shrink-0"
          style={{
            transform: `translate(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px) rotate(${mousePos.x * 0.1}deg)`
          }}
        >
          {MEDIA.videos.hero_loop.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={MEDIA.videos.hero_loop} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          ) : (
            <img
              src={MEDIA.videos.hero_loop}
              alt="Hero Visual"
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-lg md:rounded-xl shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]"></div>
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,255,0,0.02))] bg-[length:100%_2px,3px_100%] opacity-30"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-pulse-slow z-20">
        <span className="text-[10px] tracking-[0.3em] text-[var(--text-primary)] opacity-30 uppercase">{HERO.scrollMessage}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--text-primary)] to-transparent opacity-30 mx-auto mt-4" />
      </div>
    </section >
  );
};

export default Hero;
