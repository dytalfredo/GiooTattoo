
import { GoogleGenAI } from "@google/genai";

// Instancia por defecto (usada para textos si hay env var)
const defaultAi = new GoogleGenAI({ apiKey: import.meta.env.PUBLIC_GEMINI_API_KEY || '' });

export const generateInkInsight = async (idea: string): Promise<string> => {
  try {
    const response = await defaultAi.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `El usuario tiene esta idea para un tatuaje: "${idea}". 
      Responde como un filósofo de tatuajes oscuro y minimalista en 2 oraciones cortas en ESPAÑOL.
      Sugiere cómo se vería en Blackwork, Línea Fina, Neo-Tribal o Realismo Oscuro.
      Mantén un tono misterioso y artístico.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Tu visión permanece en las sombras, esperando ser grabada.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "La tinta conoce su camino incluso cuando las palabras fallan.";
  }
};

export const generateTattooDesign = async (
  skinTone: string,
  mark: string,
  bodyPart: string,
  style: string,
  description: string,
  userApiKey?: string // Parámetro opcional para la key del usuario
): Promise<string | null> => {
  try {
    // Si el usuario provee una key, usamos esa instancia. Si no, intentamos usar la variable de entorno.
    const activeKey = userApiKey || import.meta.env.PUBLIC_GEMINI_API_KEY;

    if (!activeKey) {
      console.warn("No API Key provided for image generation");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: activeKey });

    // Construct a detailed prompt focused on anatomical placement
    const prompt = `
      Generar una imagen fotorrealista y artística de un tatuaje aplicado sobre la piel.
      
      CONTEXTO ANATÓMICO (MUY IMPORTANTE):
      La imagen DEBE mostrar específicamente esta parte del cuerpo: ${bodyPart}.
      El encuadre debe centrarse en la zona: ${bodyPart}.
      
      DETALLES DEL SUJETO:
      Tono de piel (código aproximado o descripción): ${skinTone}.
      Características de la piel: El usuario menciona tener "${mark}" en la zona (integrarlo o ignorarlo sutilmente si es piel virgen).
      
      DISEÑO:
      Estilo del tatuaje: ${style}.
      Descripción del diseño: "${description}".
      
      ESTÉTICA:
      La imagen debe parecer una fotografía de alta calidad de un tatuaje curado o un render muy realista sobre piel humana.
      Iluminación dramática, estética de estudio de tatuajes, fondo neutro u oscuro para resaltar la piel y la tinta.
      La tinta debe ser negra (blackwork) a menos que la descripción pida color.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        // We rely on the text prompt to guide the style and anatomy.
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};
