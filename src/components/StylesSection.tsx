
import React from 'react';
import { TATTOO_STYLES } from '../constants';
import RevealOnScroll from './RevealOnScroll';

const StylesSection: React.FC = () => {
  return (
    <section className="bg-black py-32 px-6 md:px-24">
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <RevealOnScroll>
            <h2 className="text-[10px] tracking-[0.6em] text-red-600 font-bold uppercase mb-4">Especialidades</h2>
            <h3 className="text-5xl md:text-8xl font-black font-syncopate leading-none tracking-tighter">
              ESTILOS DE <br /> EJECUCIÓN
            </h3>
          </RevealOnScroll>
        </div>
        <div className="max-w-md text-zinc-500 text-sm leading-relaxed border-l border-zinc-800 pl-6">
          <RevealOnScroll delay={0.2}>
            Cada marca es permanente. Cada sombra tiene un propósito. Exploramos los límites del flujo anatómico y la agresión visual a través de cuatro lenguajes distintos.
          </RevealOnScroll>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TATTOO_STYLES.map((style, index) => (
          <RevealOnScroll key={style.id} delay={index * 0.1} width="100%">
            <div className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-red-600/30">
              <img 
                src={style.imageUrl} 
                alt={style.name}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
              />
              
              {/* Absolute Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <span className="text-[8px] tracking-[0.4em] text-red-600 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">ESTILO ELEGIDO</span>
                <h4 className="text-3xl font-black tracking-tighter mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{style.name}</h4>
                <p className="text-xs text-white/50 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                  {style.description}
                </p>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-red-600/50 transition-colors" />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

export default StylesSection;
