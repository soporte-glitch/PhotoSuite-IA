import { GoogleGenAI, Modality } from "@google/genai";
import { stylePrompts } from "../constants/prompts";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerationConfig {
  prompt: string;
  style: string;
  negativePrompt: string;
}

const callGeminiImageAPI = async (base64Image: string, mimeType: string, systemPrompt: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: systemPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No se devolvió ninguna imagen desde la API.');
  } catch (error) {
    console.error('Error al generar la imagen con la API de Gemini:', error);
    throw new Error('El modelo de IA no pudo procesar la imagen.');
  }
}

export const generateImage = async (base64Image: string, mimeType: string, config: GenerationConfig): Promise<string> => {
  const { prompt, style, negativePrompt } = config;

  const selectedStylePrompt = stylePrompts[style] || stylePrompts.cinematic;

  const finalPrompt = `
    Actúa como un experto en edición fotográfica y generación de imágenes. Transforma la imagen proporcionada siguiendo estas instrucciones con precisión.

    **Instrucción Principal del Usuario:** "${prompt || 'Mejora la calidad general de la imagen manteniendo un aspecto natural.'}"

    **Estilo Artístico a Aplicar:** "${selectedStylePrompt}"

    **Elementos a Evitar (Prompt Negativo):** "${negativePrompt || 'No hay elementos específicos a evitar. Céntrate en la calidad.'}"

    Tu tarea es fusionar estas instrucciones para crear una imagen visualmente impactante. No recortes, rotes ni alteres la composición fundamental de la imagen original a menos que se te pida explícitamente. Devuelve únicamente la imagen transformada con la máxima calidad posible.
  `;
  return callGeminiImageAPI(base64Image, mimeType, finalPrompt);
};

export const restoreImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const restorePrompt = `
    Actúa como un experto mundial en restauración de fotografías. Tu única tarea es restaurar la imagen proporcionada a su mejor estado posible.
    - **Mejora la nitidez:** Aumenta la claridad y el detalle sin introducir artefactos.
    - **Corrige el color:** Restaura los colores desvaídos a su tono original y vibrante.
    - **Repara daños:** Elimina arañazos, polvo, manchas y pliegues de forma impecable.
    - **Mejora rostros:** Reconstruye suavemente los detalles faciales que puedan estar borrosos o poco claros.
    - **Reduce el ruido:** Limpia el grano de la imagen manteniendo los detalles finos.
    NO alteres el contenido, la composición ni el sujeto de la foto. El objetivo es la restauración pura, no la modificación creativa. Devuelve la imagen restaurada con la máxima calidad.
  `;
  return callGeminiImageAPI(base64Image, mimeType, restorePrompt);
};

export const changeBackgroundImage = async (base64Image: string, mimeType: string, backgroundPrompt: string): Promise<string> => {
  if (!backgroundPrompt.trim()) {
    throw new Error("La descripción del nuevo fondo no puede estar vacía.");
  }
  const backgroundChangePrompt = `
    Actúa como un experto en composición de imágenes y efectos visuales. Tu tarea es reemplazar el fondo de la imagen proporcionada de manera ultrarrealista.
    1.  **Identifica al sujeto principal:** Detecta con precisión el sujeto o los sujetos en primer plano.
    2.  **Elimina el fondo original:** Recorta al sujeto perfectamente, prestando especial atención a los detalles finos como el pelo o los bordes complejos.
    3.  **Crea un nuevo fondo:** Genera un nuevo fondo basado en la siguiente descripción del usuario: "${backgroundPrompt}". El fondo debe ser fotorrealista y coherente en iluminación, perspectiva y sombras con el sujeto principal.
    4.  **Integra al sujeto:** Fusiona el sujeto principal con el nuevo fondo de manera impecable. Asegúrate de que la iluminación del sujeto coincida con la del nuevo entorno y añade sombras realistas si es necesario.
    El resultado final debe parecer una fotografía real, no una composición. Devuelve solo la imagen final.
  `;
  return callGeminiImageAPI(base64Image, mimeType, backgroundChangePrompt);
}
