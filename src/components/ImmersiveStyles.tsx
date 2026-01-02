
import React, { useRef, useEffect, useState } from 'react';
import { TATTOO_STYLES } from '../constants';
import RevealOnScroll from './RevealOnScroll';

// Internal component to handle smooth image transitions
const CrossfadeBackground: React.FC<{ src: string }> = ({ src }) => {
  const [layers, setLayers] = useState<{ src: string; id: number }[]>([{ src, id: Date.now() }]);

  useEffect(() => {
    // When prop src changes, add a new layer
    setLayers((prev) => {
      const lastLayer = prev[prev.length - 1];
      
      // If the src hasn't actually changed (e.g. double render), do nothing
      if (lastLayer.src === src) return prev;

      const newLayer = { src, id: Date.now() };
      // Keep the visual history clean: [OldImage, NewImage]
      // We keep the old one so the background doesn't flicker black while the new one fades in
      return [lastLayer, newLayer]; 
    });
  }, [src]);

  // Clean up old layers after transition finishes to save memory
  useEffect(() => {
    if (layers.length > 1) {
      const timer = setTimeout(() => {
        setLayers((prev) => [prev[prev.length - 1]]); // Keep only the newest
      }, 1000); // Matches the CSS duration
      return () => clearTimeout(timer);
    }
  }, [layers]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[var(--bg-primary)]">
      {layers.map((layer, index) => {
        // The new layer (last in array) needs to animate in. 
        // The old layer (first in array) just stays there to provide background.
        const isNew = index === layers.length - 1 && layers.length > 1;
        
        return (
          <div
            key={layer.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out will-change-transform ${
              isNew ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
            // We use a ref or simple timeout to trigger the 'enter' state
            ref={(el) => {
              if (el && isNew) {
                requestAnimationFrame(() => {
                  el.classList.remove('opacity-0', 'scale-110');
                  el.classList.add('opacity-100', 'scale-100');
                });
              }
            }}
          >
            <img
              src={layer.src}
              alt="Background"
              className="w-full h-full object-cover opacity-60"
            />
            {/* Dynamic Gradient Overlay based on Theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--overlay-gradient-mid)] to-transparent" />
          </div>
        );
      })}
    </div>
  );
};

const ImmersiveStyles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStyleIndex, setActiveStyleIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0); // 0 = Intro, 1-3 = Gallery
  
  // Configuration
  const SUB_SLIDES_PER_STYLE = 4; // 1 Intro + 3 Gallery images
  const TOTAL_SLIDES = TATTOO_STYLES.length * SUB_SLIDES_PER_STYLE;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // The start of the sticky section
      const start = top; 
      // How far we have scrolled into the container
      const scrolled = -start;
      
      // Only calculate if we are within the container's active scroll area
      if (scrolled >= 0 && scrolled <= height - viewportHeight) {
        const totalScrollableHeight = height - viewportHeight;
        const scrollProgress = scrolled / totalScrollableHeight;
        
        const rawSlideIndex = Math.floor(scrollProgress * TOTAL_SLIDES);
        const safeSlideIndex = Math.min(Math.max(rawSlideIndex, 0), TOTAL_SLIDES - 1);
        
        const styleIdx = Math.floor(safeSlideIndex / SUB_SLIDES_PER_STYLE);
        const subIdx = safeSlideIndex % SUB_SLIDES_PER_STYLE;
        
        setActiveStyleIndex(styleIdx);
        setActiveSubIndex(subIdx);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [TOTAL_SLIDES]);

  const currentStyle = TATTOO_STYLES[activeStyleIndex];
  
  // Helper to get the image to display based on sub-index
  const getCurrentImage = () => {
    if (activeSubIndex === 0) return currentStyle.imageUrl;
    return currentStyle.gallery[activeSubIndex - 1];
  };

  // Function to smoothly scroll to a specific style index
  const scrollToStyle = (index: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY;
    // Calculate the absolute top position of the container in the document
    const containerTop = rect.top + scrollTop; 
    
    const height = rect.height;
    const viewportHeight = window.innerHeight;
    const totalScrollableHeight = height - viewportHeight;
    
    // Each style occupies an equal segment of the total scrollable height
    const scrollPerStyle = totalScrollableHeight / TATTOO_STYLES.length;
    
    // Calculate target scroll position (start of the style segment)
    // Adding a small buffer (+5) ensures we land safely inside the index
    const targetScrollY = containerTop + (scrollPerStyle * index) + 5;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  return (
    <div id="estilos" className="relative bg-[var(--bg-primary)] z-20 transition-colors duration-500">
      {/* 
        Header Section - Normal Reveal 
        This part scrolls normally before hitting the pinned section
      */}
      <div className="pt-32 pb-16 px-6 md:px-24">
        <RevealOnScroll>
          <h2 className="text-[10px] tracking-[0.6em] text-red-600 font-bold uppercase mb-4">Especialidades</h2>
          <h3 className="text-4xl sm:text-5xl md:text-8xl font-black font-syncopate leading-none tracking-tighter text-[var(--text-primary)]">
            ESTILOS DE <br /> EJECUCIÓN
          </h3>
          <p className="mt-8 text-[var(--text-secondary)] text-xs md:text-sm max-w-md border-l border-[var(--border-color)] pl-6">
            Desplázate hacia abajo para explorar en detalle cada disciplina visual.
          </p>
        </RevealOnScroll>
      </div>

      {/* 
        Sticky Container 
        Height determines how long the user has to scroll. 
        300vh per style feels substantial.
      */}
      <div ref={containerRef} className="relative" style={{ height: `${TATTOO_STYLES.length * 300}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
          
          {/* Enhanced Background Image Transition */}
          <CrossfadeBackground src={getCurrentImage()} />

          {/* 
             DESKTOP NAVIGATION (VERTICAL LEFT)
             Visible only on Large screens (lg+)
          */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6">
             {TATTOO_STYLES.map((style, idx) => (
                <button
                   key={style.id}
                   onClick={() => scrollToStyle(idx)}
                   className="group flex items-center gap-4 focus:outline-none"
                   aria-label={`Ir a estilo ${style.name}`}
                >
                   {/* Indicator Line */}
                   <div 
                     className={`h-[1px] transition-all duration-500 ease-out ${
                       activeStyleIndex === idx 
                       ? 'w-12 bg-red-600' 
                       : 'w-4 bg-[var(--text-secondary)] opacity-40 group-hover:w-8 group-hover:bg-[var(--text-primary)] group-hover:opacity-100'
                     }`} 
                   />
                   
                   {/* Label */}
                   <span 
                     className={`text-[9px] uppercase tracking-[0.2em] transition-all duration-500 ${
                       activeStyleIndex === idx
                       ? 'text-red-600 font-bold translate-x-0 opacity-100'
                       : 'text-[var(--text-secondary)] -translate-x-2 opacity-50 group-hover:translate-x-0 group-hover:text-[var(--text-primary)] group-hover:opacity-100'
                     }`}
                   >
                     {style.name}
                   </span>
                </button>
             ))}
          </div>

          {/* 
             MOBILE & TABLET NAVIGATION (HORIZONTAL BOTTOM)
             Visible on screens smaller than lg (< 1024px)
          */}
          <div className="absolute bottom-6 left-0 w-full z-40 flex lg:hidden justify-between items-end px-4 gap-2 pb-4 bg-gradient-to-t from-black/80 to-transparent">
             {TATTOO_STYLES.map((style, idx) => {
               const isActive = activeStyleIndex === idx;
               return (
                <button
                   key={style.id}
                   onClick={() => scrollToStyle(idx)}
                   className="group flex-1 flex flex-col items-center gap-2 focus:outline-none"
                   aria-label={`Ir a estilo ${style.name}`}
                >
                   {/* Top Indicator Line (Horizontal for mobile) */}
                   <div 
                     className={`h-[2px] w-full transition-all duration-500 ease-out ${
                       isActive 
                       ? 'bg-red-600 opacity-100' 
                       : 'bg-[var(--text-secondary)] opacity-20'
                     }`} 
                   />
                   
                   {/* Label - Always visible but dimmed if inactive */}
                   <span 
                     className={`text-[8px] uppercase tracking-widest text-center transition-all duration-500 line-clamp-1 ${
                       isActive
                       ? 'text-red-600 font-bold opacity-100'
                       : 'text-[var(--text-secondary)] opacity-50'
                     }`}
                   >
                     {style.name.split(' ')[0]} {/* Shorten name for mobile (e.g., 'Realismo' instead of 'Realismo Oscuro') */}
                   </span>
                </button>
               );
             })}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 p-6 md:p-12 max-w-6xl w-full h-full flex flex-col justify-center">
            
            {/* 
              Content State 0: Intro (Large Title & Description)
              Visible only when subIndex === 0
            */}
            <div className={`transition-all duration-700 absolute inset-0 flex flex-col justify-center items-center text-center px-4 ${activeSubIndex === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
              <h2 className="text-[25vw] md:text-[12vw] leading-none font-black font-syncopate tracking-tighter text-[var(--text-primary)] opacity-10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {activeStyleIndex + 1}
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-8xl font-black font-syncopate tracking-tighter mb-6 relative z-10 mix-blend-overlay break-words w-full text-[var(--text-primary)]">
                {currentStyle.name}
              </h3>
              <div className="w-16 md:w-24 h-1 bg-red-600 mb-6 md:mb-8" />
              <p className="text-sm sm:text-base md:text-2xl text-[var(--text-primary)] max-w-xs md:max-w-2xl font-light leading-relaxed">
                {currentStyle.description}
              </p>
              <span className="mt-8 md:mt-12 text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-red-500 animate-pulse">
                ↓ Continúa Deslizando ↓
              </span>
            </div>

            {/* 
              Content State 1-3: Detail Images Logic (Minimal UI)
              Visible when subIndex > 0
              
              ADJUSTMENT: Moved up significantly on mobile (bottom-24) to clear the new Nav Bar
            */}
            <div className={`absolute bottom-24 right-4 md:bottom-12 md:right-12 flex flex-col items-end transition-opacity duration-500 ${activeSubIndex > 0 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-6xl md:text-[120px] leading-none font-bold text-[var(--text-primary)] opacity-10 font-syncopate">
                0{activeSubIndex}
              </span>
              <span className="text-[10px] md:text-xs tracking-[0.5em] text-red-600 uppercase font-bold">
                Detalle {activeSubIndex} / 3
              </span>
            </div>

            {/* Progress Bar for current style */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--border-color)] z-50">
              <div 
                className="h-full bg-red-600 transition-all duration-300 ease-out"
                style={{ width: `${((activeSubIndex + 1) / SUB_SLIDES_PER_STYLE) * 100}%` }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveStyles;
