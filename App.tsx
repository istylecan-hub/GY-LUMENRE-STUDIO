import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { AppState, GeneratedImage, GenerationProgress } from './types';
import { generatePhotoshoot } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Directly initialize to UPLOAD state, bypassing key check
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<GenerationProgress>({ total: 0, completed: 0, currentTask: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setUploadedImage(base64);
    setState(AppState.GENERATING);
    setErrorMsg(null);
    setGeneratedImages([]);

    try {
      const results = await generatePhotoshoot(base64, (completed, total, task) => {
        setProgress({ completed, total, currentTask: task });
      });
      
      if (results.length === 0) {
        throw new Error("No images were successfully generated. Please try a different reference photo.");
      }

      setGeneratedImages(results);
      setState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during generation.");
      setState(AppState.UPLOAD);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImages([]);
    setState(AppState.UPLOAD);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-8 mx-auto max-w-2xl bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500" />
             {errorMsg}
          </div>
        )}

        {/* STATE: UPLOAD */}
        {state === AppState.UPLOAD && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Turn One Shot Into A <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Full Catalog</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Upload a raw photo. Get 7 distinct, professional fashion studio angles.
                Identity preserved. 8K Quality.
              </p>
            </div>
            
            <UploadZone onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* STATE: GENERATING */}
        {state === AppState.GENERATING && (
          <div className="max-w-2xl mx-auto text-center mt-12 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative w-full aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
              {/* Reference Image Blurred in BG */}
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Reference" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110"
                />
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Generating Photoshoot</h3>
                <p className="text-zinc-400 mb-8">{progress.currentTask}</p>
                
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
                <div className="mt-4 flex justify-between w-full text-xs text-zinc-500 uppercase tracking-widest font-medium">
                   <span>Processing</span>
                   <span>{progress.completed} / {progress.total} Shots</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500 animate-pulse">
              This process utilizes the Gemini 3 Pro Vision model and may take up to 60 seconds.
            </p>
          </div>
        )}

        {/* STATE: RESULTS */}
        {state === AppState.RESULTS && (
          <Gallery images={generatedImages} onReset={handleReset} />
        )}

      </main>
    </div>
  );
};

export default App;