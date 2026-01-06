
import { useState } from 'react';
import { generateTattooDesign } from '../services/geminiService';
import { TATTOO_STYLES } from '../constants';
import GeminiHelp from './GeminiHelp';

interface WizardData {
  name: string;
  skinTone: string;
  mark: string;
  bodyPart: string;
  style: string;
  description: string;
}

interface ConsultationWizardProps {
  onDesignGenerated?: (imageUrl: string, description: string) => void;
}

const SKIN_TONES = [
  '#F9E4D4', '#F3D2C1', '#E6BAA3', '#D3A186',
  '#AC8368', '#8D5F43', '#683F29', '#3E2519'
];

const MARKS = [
  {
    id: 'Piel Virgen',
    label: 'Piel Virgen',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    )
  },
  {
    id: 'Con Lunares',
    label: 'Lunares',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-8 h-8">
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="14" r="2.5" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="18" cy="6" r="1" />
      </svg>
    )
  },
  {
    id: 'Cicatriz Existente',
    label: 'Cicatriz',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M4 4L10 10M8 8L12 12M14 14L20 20M18 6L6 18" />
      </svg>
    )
  },
  {
    id: 'Irregularidad',
    label: 'Irregularidad',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M12 2C8 2 8 6 5 8C2 10 2 16 6 19C10 22 15 22 19 19C22 16 22 10 19 8C16 6 16 2 12 2Z" strokeDasharray="2 2" />
        <path d="M10 10C9 12 10 14 12 15" />
      </svg>
    )
  },
];

const BODY_ZONES: Record<string, { label: string, subzones: string[] }> = {
  head: {
    label: 'Cabeza / Cuello',
    subzones: ['Cuello (Frente)', 'Cuello (Lateral)', 'Nuca (Atrás)', 'Detrás de la oreja', 'Rostro']
  },
  torso: {
    label: 'Torso / Espalda',
    subzones: ['Pecho (Pectoral)', 'Esternón', 'Costillas', 'Abdomen', 'Espalda Alta', 'Espalda Baja', 'Columna Vertebral']
  },
  arm: {
    label: 'Brazo',
    subzones: ['Hombro', 'Brazo Superior (Bíceps/Tríceps)', 'Codo', 'Antebrazo', 'Muñeca', 'Mano / Dedos']
  },
  leg: {
    label: 'Pierna',
    subzones: ['Muslo (Frente)', 'Muslo (Atrás)', 'Rodilla', 'Pantorrilla', 'Espinilla', 'Tobillo', 'Pie']
  }
};

const ConsultationWizard: React.FC<ConsultationWizardProps> = ({ onDesignGenerated }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // New states for User API Key Logic
  const [wantsImage, setWantsImage] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const [data, setData] = useState<WizardData>({
    name: '',
    skinTone: '',
    mark: '',
    bodyPart: '',
    style: '',
    description: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const updateData = (key: keyof WizardData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleZoneClick = (zoneId: string) => {
    setActiveZone(zoneId);
    updateData('bodyPart', '');
  };

  const handleAction = async () => {
    if (!data.description) return;

    if (wantsImage) {
      // Generate Image Mode
      if (!userApiKey) {
        alert("Por favor introduce una API Key válida para generar la imagen.");
        return;
      }
      setLoading(true);
      const image = await generateTattooDesign(
        data.skinTone,
        data.mark,
        data.bodyPart,
        data.style,
        data.description,
        userApiKey // Pass the user key
      );
      setGeneratedImage(image);
      setLoading(false);

      if (image && onDesignGenerated) {
        onDesignGenerated(image, data.description);
      }
    } else {
      // Text Only Mode - Skip generation
      setGeneratedImage(null);
    }

    handleNext();
  };

  const sendToWhatsApp = () => {
    const hasImage = !!generatedImage;
    const message = `
*NUEVA SOLICITUD DE TATUAJE - GIO*

*Identidad:* ${data.name}

*Detalles del Proyecto:*
• Zona Específica: ${data.bodyPart}
• Condición de piel: ${data.mark}
• Estilo: ${data.style}

*Concepto:*
"${data.description}"

*Referencia Visual:* ${hasImage ? 'ADJUNTA (Generada por IA)' : 'NO GENERADA (Solo Texto)'}

---
*Nota:* ${hasImage ? 'Adjuntaré la imagen descargada a este mensaje.' : 'Espero tu respuesta para discutir los detalles.'}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "51934021923";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `GIO_CONCEPT_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2 align-middle">
      <div className="cursor-help text-[var(--text-secondary)] hover:text-red-500 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-[var(--border-color)] text-[9px] text-[var(--text-secondary)] uppercase tracking-wider leading-tight text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
      </div>
    </div>
  );

  const BodyMap = () => (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-full flex justify-center items-center my-4">
        <svg viewBox="0 0 200 400" className="h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          {/* Head */}
          <path
            d="M100 20 C85 20 75 35 75 50 C75 65 85 75 100 75 C115 75 125 65 125 50 C125 35 115 20 100 20"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'head' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('head')}
          />
          {/* Torso */}
          <path
            d="M75 80 L125 80 L130 180 L70 180 Z"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'torso' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('torso')}
          />
          {/* Left Arm */}
          <path
            d="M70 80 L50 180 L65 180 L80 90 Z"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'arm' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('arm')}
          />
          {/* Right Arm */}
          <path
            d="M130 80 L150 180 L135 180 L120 90 Z"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'arm' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('arm')}
          />
          {/* Left Leg */}
          <path
            d="M70 185 L60 350 L85 350 L95 185 Z"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'leg' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('leg')}
          />
          {/* Right Leg */}
          <path
            d="M130 185 L140 350 L115 350 L105 185 Z"
            className={`cursor-pointer transition-all duration-300 ${activeZone === 'leg' ? 'fill-red-600' : 'fill-[var(--text-secondary)] hover:fill-[var(--text-primary)]'}`}
            onClick={() => handleZoneClick('leg')}
          />
        </svg>
      </div>

      <div className="min-h-[100px] w-full mt-4">
        {activeZone ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-center text-[10px] text-red-500 uppercase tracking-widest mb-3 font-bold">
              {BODY_ZONES[activeZone].label} &mdash; Especificar:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BODY_ZONES[activeZone].subzones.map((subzone) => (
                <button
                  key={subzone}
                  onClick={() => updateData('bodyPart', `${BODY_ZONES[activeZone].label}: ${subzone}`)}
                  className={`py-2 px-1 text-[9px] uppercase tracking-wider border transition-all ${data.bodyPart === `${BODY_ZONES[activeZone].label}: ${subzone}`
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                    }`}
                >
                  {subzone}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-[var(--text-secondary)] text-[10px] uppercase tracking-widest italic">
            Selecciona una zona en el mapa para desplegar opciones.
          </p>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0: // Skin Tone
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-syncopate font-bold text-center text-[var(--text-primary)]">
              EL LIENZO
              <Tooltip text="El tono de tu piel influye en cómo se verán ciertos pigmentos y contrastes." />
            </h3>
            <p className="text-[var(--text-secondary)] text-center text-xs">Selecciona el tono base.</p>
            <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateData('skinTone', tone)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${data.skinTone === tone ? 'border-red-600 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>
        );
      case 1: // Marks
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-syncopate font-bold text-center text-[var(--text-primary)]">
              LA TEXTURA
              <Tooltip text="Indica si hay cicatrices o lunares para adaptar la técnica del diseño." />
            </h3>
            <p className="text-[var(--text-secondary)] text-center text-xs">Pre-existencias en la piel.</p>
            <div className="grid grid-cols-2 gap-3">
              {MARKS.map((mark) => (
                <button
                  key={mark.id}
                  onClick={() => updateData('mark', mark.id)}
                  className={`p-4 border transition-all duration-300 flex flex-col items-center gap-3 ${data.mark === mark.id ? 'border-red-600 bg-red-900/10 text-[var(--text-primary)]' : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)] text-[var(--text-secondary)]'}`}
                >
                  <span className="text-inherit scale-75">{mark.icon}</span>
                  <span className="text-[9px] uppercase tracking-widest">{mark.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2: // Body Part
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-syncopate font-bold text-center text-[var(--text-primary)]">
              LA UBICACIÓN
              <Tooltip text="Elige la zona del cuerpo para ajustar la escala, el flujo y el detalle." />
            </h3>
            <p className="text-[var(--text-secondary)] text-center text-xs">¿Dónde residirá?</p>
            <BodyMap />
          </div>
        );
      case 3: // Style
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-syncopate font-bold text-center text-[var(--text-primary)]">
              EL LENGUAJE
              <Tooltip text="Cada estilo tiene una narrativa técnica distinta. Elige el que mejor resuene." />
            </h3>
            <p className="text-[var(--text-secondary)] text-center text-xs">Dialecto visual.</p>
            <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {TATTOO_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateData('style', style.name)}
                  className={`p-3 text-left border transition-all duration-300 ${data.style === style.name ? 'border-red-600 bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}`}
                >
                  <span className="font-syncopate font-bold text-xs">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4: // Description & Config (Generate or Just Send)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-syncopate font-bold text-center text-[var(--text-primary)]">
              LA VISIÓN
              <Tooltip text="Describe tu idea. Si prefieres no usar IA, puedes enviar solo tu descripción de texto." />
            </h3>
            <p className="text-[var(--text-secondary)] text-center text-xs uppercase tracking-widest font-bold text-red-500">IMPORTANTE: ¿CÓMO QUIERES CONTINUAR?</p>

            <textarea
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              className="w-full h-24 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 text-[var(--text-primary)] focus:outline-none focus:border-red-600 text-xs resize-none placeholder-[var(--text-secondary)]"
              placeholder="Un cráneo geométrico floreciendo..."
            />

            {/* Toggle Mode */}
            <div className="flex gap-4 border-t border-[var(--border-color)] pt-4">
              <button
                onClick={() => setWantsImage(false)}
                className={`flex-1 py-2 text-[9px] uppercase tracking-widest border transition-all ${!wantsImage ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]'}`}
              >
                Solo Texto
              </button>
              <button
                onClick={() => setWantsImage(true)}
                className={`flex-1 py-2 text-[9px] uppercase tracking-widest border transition-all ${wantsImage ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]'}`}
              >
                Generar Visual
              </button>
            </div>

            {/* API Key Input Section (Only if wantsImage is true) */}
            {wantsImage && (
              <div className="space-y-2 animate-in fade-in duration-300 bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)] border-l-2 border-l-red-600">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-[var(--text-primary)] font-bold uppercase tracking-wider">Gemini API Key</label>
                  <button
                    onClick={() => setShowHelp(true)}
                    className="text-[9px] text-red-500 hover:text-red-400 underline decoration-dotted"
                  >
                    ¿Cómo obtenerla?
                  </button>
                </div>
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="Pega tu clave aquí..."
                  className="w-full bg-black/30 border border-[var(--border-color)] p-2 text-[var(--text-primary)] text-xs focus:outline-none focus:border-red-600"
                />
                <p className="text-[8px] text-[var(--text-secondary)]">
                  Tu clave solo se usa para esta solicitud y no se guarda.
                </p>
              </div>
            )}

            <button
              onClick={handleAction}
              disabled={loading || !data.description || (wantsImage && !userApiKey)}
              className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-syncopate font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'PROCESANDO...' : (wantsImage ? 'GENERAR CONCEPTO' : 'FINALIZAR SOLICITUD')}
            </button>
          </div>
        );
      case 5: // Final Step: Name, Image (Optional) & WhatsApp
        return (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-syncopate font-bold text-[var(--text-primary)]">CONFIRMACIÓN</h3>
              <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-widest">
                {generatedImage ? 'Descarga tu referencia y finaliza' : 'Completa tus datos para finalizar'}
              </p>
            </div>

            {/* Generated Image Card - Only if exists */}
            {wantsImage && (
              <div className="aspect-square w-full max-w-sm mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 relative group">
                {generatedImage ? (
                  <>
                    <img src={generatedImage} alt="Generated Tattoo" className="w-full h-full object-contain" />
                    <button
                      onClick={downloadImage}
                      className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span>↓ Descargar</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)] gap-2">
                    <span className="text-2xl">⚠</span>
                    <span className="text-xs italic text-center px-4">Error al generar visual. <br />Verifica tu API Key o cuota.</span>
                  </div>
                )}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2 max-w-sm mx-auto w-full">
              <label className="text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase font-bold block text-left">Tu Nombre</label>
              <input
                required
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 text-[var(--text-primary)] focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Identidad para la cita..."
              />
            </div>

            {/* WhatsApp Action */}
            <button
              onClick={sendToWhatsApp}
              disabled={!data.name}
              className="w-full max-w-sm mx-auto py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-syncopate font-bold tracking-[0.3em] uppercase transition-all flex flex-col items-center justify-center gap-3 border border-transparent hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="shrink-0 transition-transform group-hover:scale-110">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z" />
                </svg>
                <span className="text-center">Enviar Solicitud</span>
              </div>
              <span className="text-[7px] tracking-[0.5em] opacity-60">Cifrado de Final a Final</span>
            </button>

            <p className="text-[9px] text-[var(--text-secondary)] text-center max-w-xs mx-auto">
              Al hacer clic, se abrirá WhatsApp con los detalles de tu formulario precargados. {generatedImage && "No olvides adjuntar la imagen descargada."}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 md:p-8 relative overflow-hidden h-full flex flex-col transition-colors duration-500">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-[var(--bg-secondary)] w-full">
        <div
          className="h-full bg-red-600 transition-all duration-500"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* NEW TOP LEFT BACK BUTTON */}
      {step > 0 && !loading && (
        <button
          onClick={handleBack}
          className="absolute top-8 left-6 md:left-8 text-[var(--text-secondary)] hover:text-red-600 transition-colors z-20 p-2 -ml-2"
          title="Regresar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="mb-8 text-center mt-4">
        <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-[0.4em]">Asistente de Diseño</span>
        <h2 className="text-sm md:text-base font-syncopate font-bold text-[var(--text-primary)] uppercase tracking-wider mt-2">
          Define tu visión paso a paso
        </h2>
        <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest mt-1 max-w-xs mx-auto leading-relaxed">
          Configura los parámetros técnicos y estéticos de tu proyecto antes de enviarlo.
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {step < 5 && !loading && (
        <div className="mt-8 flex justify-between items-center border-t border-[var(--border-color)] pt-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`text-[9px] uppercase tracking-[0.2em] transition-colors ${step === 0 ? 'text-[var(--text-secondary)] opacity-50 cursor-not-allowed' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            ← Atrás
          </button>
          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={
                (step === 0 && !data.skinTone) ||
                (step === 1 && !data.mark) ||
                (step === 2 && !data.bodyPart) ||
                (step === 3 && !data.style)
              }
              className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-primary)] hover:text-red-600 transition-colors disabled:opacity-30 disabled:hover:text-[var(--text-primary)]"
            >
              Sig. →
            </button>
          )}
        </div>
      )}

      <GeminiHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default ConsultationWizard;
