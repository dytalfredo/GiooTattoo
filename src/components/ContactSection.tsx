import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import ConsultationWizard from './ConsultationWizard';
import { CONTACT } from '../constants';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="bg-[var(--bg-primary)] py-32 px-6 md:px-24 border-t border-[var(--border-color)] relative overflow-hidden min-h-screen flex items-center transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--text-primary)] opacity-5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10">

        <div className="text-center mb-16">
          <RevealOnScroll width="100%">
            <span className="text-[10px] tracking-[0.6em] text-[var(--text-secondary)] font-bold uppercase mb-4 block">{CONTACT.label}</span>
            <h2 className="text-4xl md:text-7xl font-black font-syncopate tracking-tighter leading-none text-[var(--text-primary)] uppercase">
              {CONTACT.title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {word === 'IDEA' ? <span className="text-red-600">{word}</span> : word}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className="mt-6 text-[var(--text-secondary)] text-sm max-w-xl mx-auto leading-relaxed">
              {CONTACT.description}
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
