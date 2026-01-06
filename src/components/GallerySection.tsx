import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { GALLERY, MEDIA } from '../constants';

// Images with varying aspect ratios to create the "Tumblr" masonry feel
const GALLERY_IMAGES = MEDIA.gallery_grid;

const GallerySection: React.FC = () => {
  return (
    <section id="trabajos" className="bg-[var(--bg-primary)] py-32 px-4 md:px-12 relative z-10 transition-colors duration-500">
      <div className="mb-24 px-4 text-center">
        <RevealOnScroll width="100%">
          <h2 className="text-[10px] tracking-[0.8em] text-[var(--text-secondary)] font-bold uppercase mb-6">{GALLERY.label}</h2>
          <h2 className="text-4xl md:text-6xl font-black font-syncopate tracking-tighter text-[var(--text-primary)] opacity-90">
            {GALLERY.title}
          </h2>
          <div className="w-[1px] h-16 bg-red-600 mx-auto mt-8 opacity-50" />
        </RevealOnScroll>
      </div>

      {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {GALLERY_IMAGES.map((img, index) => (
          <RevealOnScroll key={index} delay={index % 3 * 0.1} width="100%" className="break-inside-avoid">
            <div className="relative group overflow-hidden bg-[var(--bg-secondary)] mb-4 cursor-crosshair">

              {/* Image Layer */}
              <img
                src={img.url}
                alt={img.alt}
                width={800}
                height={1200}
                className="w-full object-cover grayscale transition-all duration-700 ease-out 
                             brightness-[0.6] contrast-[1.1] 
                             group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-100"
              />

              {/* Subtle Red Overlay (Mix Blend) - Adds depth without coloring the photo */}
              <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Minimalist Border Frame */}
              <div className="absolute inset-4 border border-white/10 group-hover:border-white/30 scale-[0.98] group-hover:scale-100 transition-all duration-500 ease-out pointer-events-none" />

              {/* Top Right: Technical ID */}
              <div className="absolute top-8 right-8 overflow-hidden">
                <span className="block text-[8px] font-mono text-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  REF_00{index + 1}
                </span>
              </div>

              {/* Bottom Left: Title & Line */}
              <div className="absolute bottom-8 left-8 z-10">
                <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {img.alt}
                </h4>
                <div className="w-0 group-hover:w-12 h-[1px] bg-red-600 mt-2 transition-all duration-700 ease-out delay-200" />
              </div>

              {/* Date Stamp - Fade out on hover to reduce clutter */}
              <div className="absolute bottom-2 right-2 px-2 py-1 opacity-30 group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-[8px] font-mono text-white">2024</span>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <div className="text-center mt-24">
        <RevealOnScroll>
          <p className="text-[var(--text-secondary)] text-xs italic tracking-widest hover:text-red-600 cursor-pointer transition-colors">
            {GALLERY.loadMore}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default GallerySection;
