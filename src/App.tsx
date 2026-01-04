
import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import ImmersiveStyles from './components/ImmersiveStyles';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import SmokeEffect from './components/SmokeEffect';
import LoadingScreen from './components/LoadingScreen';
import PhilosophyScroll from './components/PhilosophyScroll';

// Inicializar Firebase (Analytics) - REMOVED
// import './services/firebaseConfig';

import { COMPANY, NAVIGATION, MEDIA } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMeditative, setIsMeditative] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  // Ensure default track is robust
  const [currentTrack, setCurrentTrack] = useState(MEDIA.audio.playlist && MEDIA.audio.playlist.length > 0 ? MEDIA.audio.playlist[0] : { title: "Ambient", url: MEDIA.audio.ambient_track });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Audio play failed or was interrupted:", e);
        });
      }
    }
  };

  const changeTrack = (track: typeof MEDIA.audio.playlist[0]) => {
    if (!audioRef.current) return;

    // Pause current playback to avoid AbortError/Interruption
    audioRef.current.pause();

    setCurrentTrack(track);
    setShowTrackSelector(false); // Close selector after choice
  };

  // Effect to resume playing after track change if it was playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      // Small timeout to ensure DOM has updated src
      const timer = setTimeout(() => {
        const playPromise = audioRef.current?.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log("Auto-resume interrupted:", e));
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentTrack]); // Only run when track changes

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLoaded = () => {
    // Prevent multiple calls
    if (!isLoading) return;

    setIsLoading(false);
    // Try to auto-play when loading finishes
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Autoplay blocked - user must click the button manually.
        console.log("Autoplay blocked waiting for user interaction");
      });
    }
  };

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    scrollToSection('contact');
  };

  const scrollToTop = () => {
    scrollToSection('top');
  };

  return (
    <>
      <LoadingScreen onLoaded={handleLoaded} />

      {/* Native Audio Element for better control */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* 
        Main content is always rendered in DOM but hidden/revealed to ensure layouts are calculated.
      */}
      <main className={`relative min-h-screen transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>

        {/* Smoke Effect Overlay (Global atmosphere) */}
        <SmokeEffect intensity={isMeditative ? 'high' : 'normal'} theme={theme} />

        {/* Sticky Header Nav */}
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">
            {/* Logo Button - Triggers Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="text-[var(--text-primary)] font-black tracking-tighter text-xl hover:text-red-600 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none relative z-50 uppercase"
              aria-label="Volver arriba"
              style={{ textShadow: theme === 'dark' ? '0 0 20px rgba(255,255,255,0.3)' : 'none' }}
            >
              {COMPANY.name}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-600 hover:border-red-600 transition-all bg-[var(--bg-secondary)]"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>

            {/* Track Selector & Audio Controls */}
            <div className="flex items-center gap-2 relative">
              {/* Selector Trigger */}
              <button
                onClick={() => setShowTrackSelector(!showTrackSelector)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-red-600 transition-colors"
              >
                <span className="max-w-[80px] md:max-w-[100px] truncate">{currentTrack?.title || "Ambient"}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showTrackSelector ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Track Selector Dropdown */}
              {showTrackSelector && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 shadow-xl flex flex-col gap-1 z-[60]">
                  {MEDIA.audio.playlist.map((track, idx) => (
                    <button
                      key={idx}
                      onClick={() => changeTrack(track)}
                      className={`text-left text-[10px] uppercase tracking-widest p-2 hover:bg-[var(--bg-primary)] hover:text-red-600 transition-colors ${currentTrack?.url === track.url ? 'text-red-600' : 'text-[var(--text-secondary)]'}`}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Toggle Button */}
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-full border transition-all bg-[var(--bg-secondary)] flex items-center justify-center gap-2 ${isPlaying ? 'border-red-600 text-red-600' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-red-600 hover:text-white'}`}
                aria-label="Alternar música"
              >
                {isPlaying ? (
                  <>
                    {/* Sound Wave Animation */}
                    <div className="flex items-end gap-[2px] h-3">
                      <span className="w-[2px] bg-current h-full animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                      <span className="w-[2px] bg-current h-2/3 animate-[pulse_0.7s_ease-in-out_infinite]"></span>
                      <span className="w-[2px] bg-current h-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                    </div>
                  </>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="hidden md:flex gap-8 pointer-events-auto">
            {NAVIGATION.items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] tracking-[0.3em] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto">
            <button
              onClick={scrollToContact}
              className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-3 py-1 md:px-6 md:py-2 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-600 hover:text-white transition-all"
            >
              Reservar
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <Hero theme={theme} />

        {/* Immersive Scroll Section */}
        <ImmersiveStyles />

        {/* Gallery Section */}
        <GallerySection />

        {/* Text Scrollytelling Section triggers the Meditative state */}
        <PhilosophyScroll onInViewChange={setIsMeditative} />

        {/* Contact Section now includes the Wizard logic */}
        <ContactSection />

        {/* Footer */}
        <footer className="bg-[var(--bg-primary)] pt-24 pb-12 px-6 md:px-24 border-t border-[var(--border-color)] transition-colors duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-black font-syncopate tracking-tighter text-[var(--text-primary)] uppercase">{COMPANY.name}</h2>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
                {COMPANY.description}
              </p>
              <div className="flex flex-col gap-1 text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mt-4">
                <span>{COMPANY.accessInfo}</span>
                <span className="text-red-600 mt-2">{COMPANY.address}</span>
              </div>
            </div>

            {/* Links Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase">Explorar</h4>
              <ul className="space-y-4">
                {NAVIGATION.footerLinks.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-xs text-[var(--text-secondary)] hover:text-red-600 transition-colors uppercase tracking-widest text-left bg-transparent border-none p-0 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social / Contact Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-primary)] uppercase">Conectar</h4>
              <ul className="space-y-4">
                <li><a href={COMPANY.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-red-600 transition-colors uppercase tracking-widest block">Instagram</a></li>
                <li><a href={`mailto:${COMPANY.social.email}`} className="text-xs text-[var(--text-secondary)] hover:text-red-600 transition-colors uppercase tracking-widest block">Email</a></li>
                <li><a href={COMPANY.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-red-600 transition-colors uppercase tracking-widest block">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-[var(--text-secondary)] tracking-[0.2em] uppercase">
              &copy; {COMPANY.copyright}
            </p>
            <div className="flex gap-8">
              {NAVIGATION.legalLinks.map((link, idx) => (
                <a key={idx} href={link.url} className="text-[9px] text-[var(--text-secondary)] tracking-[0.1em] hover:text-[var(--text-primary)] uppercase transition-colors">{link.label}</a>
              ))}
            </div>
          </div>
        </footer>

        {/* Custom Cursor Overlay - Inverted in light mode */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] mix-blend-difference">
        </div>
      </main>
    </>
  );
};

export default App;
