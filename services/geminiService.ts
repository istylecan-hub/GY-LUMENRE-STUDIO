import { GoogleGenAI } from "@google/genai";
import { POSES, SYSTEM_INSTRUCTION } from '../constants';
import { PoseConfig, GeneratedImage } from '../types';

// Helper to convert blob to base64 for display/download if needed
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generatePhotoshoot = async (
  referenceImageBase64: string,
  onProgress: (completed: number, total: number, task: string) => void
): Promise<GeneratedImage[]> => {
  // Primary model (High Quality)
  const PRIMARY_MODEL = 'gemini-3-pro-image-preview';
  // Fallback model (Standard)
  const FALLBACK_MODEL = 'gemini-2.5-flash-image';
  
  let activeModel = PRIMARY_MODEL;
  let hasFallenBack = false;

  // Clean base64 string if it contains metadata header
  const cleanBase64 = referenceImageBase64.split(',')[1] || referenceImageBase64;

  const results: GeneratedImage[] = [];
  let completedCount = 0;
  
  // Process poses sequentially to handle fallback logic reliably
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  for (const pose of POSES) {
     onProgress(completedCount, POSES.length, `Generating ${pose.label}...`);

     // Helper to try generation
     const tryGenerate = async (model: string): Promise<string | null> => {
       const ai = new GoogleGenAI({ apiKey });
       
       const config: any = {
         imageConfig: {
            aspectRatio: "3:4",
         }
       };

       // Only add imageSize for the Pro model
       if (model === PRIMARY_MODEL) {
         config.imageConfig.imageSize = "2K";
       }

       const response = await ai.models.generateContent({
         model: model,
         contents: {
           parts: [
             {
               text: `${SYSTEM_INSTRUCTION}\n\nGENERATE THIS SPECIFIC SHOT:\n${pose.promptDescription}\n\nEnsure the person is IDENTICAL to the reference image provided.`
             },
             {
               inlineData: {
                 mimeType: 'image/jpeg',
                 data: cleanBase64
               }
             }
           ]
         },
         config: config
       });

       if (response.candidates && response.candidates[0].content.parts) {
         for (const part of response.candidates[0].content.parts) {
           if (part.inlineData && part.inlineData.data) {
             return `data:image/png;base64,${part.inlineData.data}`;
           }
         }
       }
       return null;
     };

     let imageUrl: string | null = null;
     
     try {
       imageUrl = await tryGenerate(activeModel);
     } catch (e: any) {
       // Check for permission denied (403) or not found (404) or general API error
       // The error object structure varies, checking string representation covers most cases
       const isPermissionError = e.message?.includes('403') || e.status === 403 || e.toString().includes('PERMISSION_DENIED') || e.toString().includes('403');
       
       if (isPermissionError && !hasFallenBack) {
         console.warn(`Permission denied for ${activeModel}. Switching to fallback model ${FALLBACK_MODEL}.`);
         activeModel = FALLBACK_MODEL;
         hasFallenBack = true;
         try {
           imageUrl = await tryGenerate(activeModel);
         } catch (fallbackError) {
           console.error(`Fallback model also failed for ${pose.label}`, fallbackError);
         }
       } else {
         console.error(`Error generating ${pose.label} with ${activeModel}:`, e);
       }
     }

     if (imageUrl) {
       results.push({
         id: pose.id,
         label: pose.label,
         url: imageUrl,
         timestamp: Date.now()
       });
     }
     
     completedCount++;
     onProgress(completedCount, POSES.length, "Processing...");
  }

  return results;
};