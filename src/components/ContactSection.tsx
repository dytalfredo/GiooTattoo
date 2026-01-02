
import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import ConsultationWizard from './ConsultationWizard';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="bg-[var(--bg-primary)] py-32 px-6 md:px-24 border-t border-[var(--border-color)] relative overflow-hidden min-h-screen flex items-center transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--text-primary)] opacity-5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        <div className="text-center mb-16">
          <RevealOnScroll width="100%">
            <h2 className="text-[10px] tracking-[0.6em] text-[var(--text-secondary)] font-bold uppercase mb-4">Contacto Directo</h2>
            <h3 className="text-4xl md:text-7xl font-black font-syncopate tracking-tighter leading-none text-[var(--text-primary)]">
              COMPÁRTEME TU <span className="text-red-600">IDEA</span>
            </h3>
            <p className="mt-6 text-[var(--text-secondary)] text-sm max-w-xl mx-auto leading-relaxed">
              Esta es la vía más efectiva para asegurar tu sesión. Olvida los correos genéricos; utiliza este asistente interactivo para definir tu proyecto con precisión. Las propuestas enviadas por este medio tienen prioridad absoluta en mi agenda.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.2} width="100%">
            <div className="w-full shadow-2xl shadow-red-900/10">
                <ConsultationWizard />
            </div>
        </RevealOnScroll>
        
      </div>
    </section>
  );
};

export default ContactSection;
