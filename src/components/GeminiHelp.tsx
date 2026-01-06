
import { type FC } from 'react';

interface GeminiHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeminiHelp: FC<GeminiHelpProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-syncopate font-bold text-[var(--text-primary)]">GUÍA DE IA</h2>
                        <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">Generación de Conceptos Visuales</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-2"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest border-l-2 border-red-600 pl-3">¿Qué es Gemini?</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Gemini es la Inteligencia Artificial de Google. La utilizamos para transformar tu descripción textual en una referencia visual única que me ayudará a entender mejor tu visión antes de la cita.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest border-l-2 border-red-600 pl-3">Pasos para obtener tu clave (Gratis)</h3>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-red-600 flex items-center justify-center text-[10px] font-bold text-red-600">1</span>
                                <div>
                                    <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase">Ingresa a Google AI Studio</h4>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                                        Ve a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-500 underline">aistudio.google.com</a> e inicia sesión con tu cuenta de Google.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-red-600 flex items-center justify-center text-[10px] font-bold text-red-600">2</span>
                                <div>
                                    <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase">Crea tu API Key</h4>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                                        Haz clic en el botón azul <span className="text-[var(--text-primary)] font-bold">"Create API key"</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-red-600 flex items-center justify-center text-[10px] font-bold text-red-600">3</span>
                                <div>
                                    <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase">Copia y Pega</h4>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                                        Copia el código generado y pégalo en el formulario del asistente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-red-900/10 border border-red-900/20 p-4 space-y-3">
                        <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Nota Importante
                        </h3>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
                            Si no deseas generar una clave, <span className="text-[var(--text-primary)] font-bold">puedes elegir la opción "SOLO TEXTO"</span>. Esto me enviará tu descripción directamente sin procesar una imagen previa. Es igual de válido para iniciar tu proyecto.
                        </p>
                    </section>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-syncopate font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                        ENTENDIDO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeminiHelp;
