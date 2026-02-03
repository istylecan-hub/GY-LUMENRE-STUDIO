import { GoogleGenAI } from "@google/genai";
import { PRODUCT_PRESETS, SYSTEM_INSTRUCTION, POSE_STYLES, BACKGROUND_STYLES, PARTY_BACKGROUNDS, FABRIC_EMPHASIS_STYLES } from '../constants';
import { GeneratedImage, ProductType, PoseStyle, BackgroundStyle, PartyBackgroundType, FabricEmphasisType, ModelTier } from '../types';

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper to compress image if needed
const compressImage = async (base64: string, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      const MAX_DIM = 1280; 
      if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width *= ratio;
          height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64); 
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (e) => resolve(base64); 
    img.src = base64;
  });
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 5,
  delay: number = 3000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const status = error.status || error.response?.status || error.error?.code || error.error?.status;
    const message = error.message || error.error?.message || JSON.stringify(error);
    
    const isOverloaded = 
        status === 503 || 
        (typeof message === 'string' && (
            message.includes('overloaded') || 
            message.includes('Overloaded') ||
            message.includes('UNAVAILABLE')
        )) ||
        status === 'UNAVAILABLE';

    const shouldRetry = 
      retries > 0 && (
        status === 500 || 
        status === 503 || 
        status === 429 ||
        (typeof message === 'string' && (
            message.includes('Internal error') ||
            message.includes('500')
        )) ||
        isOverloaded
      );

    if (shouldRetry) {
      const waitTime = isOverloaded ? Math.max(delay, 5000) : delay;
      console.warn(`API Error (${status}: ${message}). Retrying in ${waitTime}ms... (${retries} attempts left)`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return retryOperation(operation, retries - 1, waitTime * 1.5);
    }
    throw error;
  }
};

export const generatePhotoshoot = async (
  referenceImagesBase64: string[],
  productType: ProductType,
  poseStyle: PoseStyle,
  backgroundStyle: BackgroundStyle,
  selectedPoseIds: string[],
  onProgress: (completed: number, total: number, task: string) => void,
  partyBackground?: PartyBackgroundType,
  fabricEmphasis?: FabricEmphasisType,
  tier: ModelTier = 'FREE'
): Promise<GeneratedImage[]> => {
  
  // 2. Select Model & Key
  // Use process.env.API_KEY exclusively as per guidelines.
  // Model selection depends on tier.
  let activeModel = 'gemini-2.5-flash-image';

  if (tier === 'PRO') {
    activeModel = 'gemini-3-pro-image-preview'; 
    console.log(`[Lumière] Using High-Fidelity Model (Pro): ${activeModel}`);
  } else {
    // gemini-2.5-flash-image is the default for general image tasks
    console.log(`[Lumière] Using Standard Model (Free): ${activeModel}`);
  }

  // 3. Initialize Client
  // API Key must be obtained exclusively from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const allPoses = PRODUCT_PRESETS[productType];
  const stylePrompt = POSE_STYLES[poseStyle];
  
  let backgroundPrompt = BACKGROUND_STYLES[backgroundStyle];
  if (poseStyle === 'URBAN_NIGHT' && partyBackground) {
      backgroundPrompt = PARTY_BACKGROUNDS[partyBackground];
  }
  
  const fabricPrompt = fabricEmphasis ? FABRIC_EMPHASIS_STYLES[fabricEmphasis] : "";

  if (!allPoses) {
    throw new Error(`Invalid product type: ${productType}`);
  }

  const poses = allPoses.filter(p => selectedPoseIds.includes(p.id));
  
  if (poses.length === 0) {
    throw new Error("No poses selected for generation.");
  }

  const results: GeneratedImage[] = [];
  let completedCount = 0;

  const SAFE_PAYLOAD_LIMIT = 15 * 1024 * 1024;
  const currentTotalSize = referenceImagesBase64.reduce((acc, str) => acc + str.length, 0);

  let processedImages = referenceImagesBase64;

  if (currentTotalSize > SAFE_PAYLOAD_LIMIT) {
    onProgress(0, poses.length, "Optimizing images for upload...");
    processedImages = await Promise.all(referenceImagesBase64.map(img => compressImage(img)));
  }

  const referenceParts = processedImages.map(base64 => {
    const mimeMatch = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = base64.split(',')[1] || base64;
    
    return {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64
      }
    };
  });

  // 4. Loop with Tier Specific Logic
  for (const pose of poses) {
     onProgress(completedCount, poses.length, `Generating ${pose.label}...`);

     try {
       const response = await retryOperation(async () => {
         return await ai.models.generateContent({
           model: activeModel,
           contents: {
             parts: [
               {
                 text: `${SYSTEM_INSTRUCTION}\n\n${backgroundPrompt}\n\n${stylePrompt}\n\n${fabricPrompt}\n\nGENERATE THIS SPECIFIC SHOT:\n${pose.promptDescription}\n\nUse ALL provided reference images to ensure the person and clothing are IDENTICAL.`
               },
               ...referenceParts
             ]
           },
           config: {
             imageConfig: {
                aspectRatio: "3:4",
                // Flash model might not support "2K" param, strictly only use it for Pro
                ...(tier === 'PRO' ? { imageSize: "2K" } : {}) 
             }
           }
         });
       });

       if (response.candidates && response.candidates[0].content.parts) {
         for (const part of response.candidates[0].content.parts) {
           if (part.inlineData && part.inlineData.data) {
             results.push({
               id: pose.id,
               label: pose.label,
               url: `data:image/png;base64,${part.inlineData.data}`,
               timestamp: Date.now()
             });
             break;
           }
         }
       }
     } catch (e: any) {
       console.error(`Error generating ${pose.label}:`, e);
     }

     completedCount++;
     onProgress(completedCount, poses.length, "Processing...");
  }

  return results;
};