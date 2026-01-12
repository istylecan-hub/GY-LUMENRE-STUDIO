import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Gallery } from './components/Gallery';
import { HistoryView } from './components/HistoryView';
import { Button } from './components/Button';
import { AppState, GeneratedImage, GenerationProgress, HistoryItem, ProductType, PoseStyle, BackgroundStyle, PartyBackgroundType, FabricEmphasisType } from './types';
import { generatePhotoshoot } from './services/geminiService';
import { Loader2, KeyRound } from 'lucide-react';

// IndexedDB configuration for robust storage of high-res base64 images
const DB_NAME = 'LumiereStudioDB';
const STORE_NAME = 'history';
const DB_VERSION = 2; // Incremented version to handle referenceImages array

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      // Migration logic if needed could go here
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.CHECKING_KEY);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [progress, setProgress] = useState<GenerationProgress>({ total: 0, completed: 0, currentTask: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial Check for API Key & Load History
  useEffect(() => {
    const init = async () => {
      // 1. Check API Key Status
      const win = window as any;
      if (win.aistudio && await win.aistudio.hasSelectedApiKey()) {
        setState(AppState.UPLOAD);
      } else {
        setState(AppState.CHECKING_KEY);
      }

      // 2. Load History
      try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          const raw = request.result as any[];
          // Backward compatibility for single referenceImage history
          const migrated = raw.map(item => ({
            ...item,
            referenceImages: item.referenceImages || (item.referenceImage ? [item.referenceImage] : []),
            productType: item.productType || 'TOPS', // Default for old items
            poseStyle: item.poseStyle || 'COMMERCIAL',
            backgroundStyle: item.backgroundStyle || 'STUDIO_GREY',
            partyBackground: item.partyBackground || undefined,
            fabricEmphasis: item.fabricEmphasis || undefined
          })) as HistoryItem[];
          
          const sorted = migrated.sort((a, b) => b.timestamp - a.timestamp);
          setHistory(sorted);
        };
      } catch (err) {
        console.error("Failed to load history from IndexedDB", err);
      }
    };
    init();
  }, []);

  const handleSelectKey = async () => {
    setErrorMsg(null);
    const win = window as any;
    if (win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        setState(AppState.UPLOAD);
      } catch (e) {
        setErrorMsg("Failed to select API key. Please try again.");
      }
    } else {
      // Fallback for dev environments
      setState(AppState.UPLOAD);
    }
  };

  const handleImagesSelected = async (
    base64Array: string[], 
    productType: ProductType, 
    poseStyle: PoseStyle, 
    backgroundStyle: BackgroundStyle, 
    selectedPoseIds: string[],
    partyBackground?: PartyBackgroundType,
    fabricEmphasis?: FabricEmphasisType
  ) => {
    setReferenceImages(base64Array);
    setState(AppState.GENERATING);
    setErrorMsg(null);
    setGeneratedImages([]);

    try {
      const results = await generatePhotoshoot(
        base64Array, 
        productType, 
        poseStyle, 
        backgroundStyle, 
        selectedPoseIds, 
        (completed, total, task) => {
          setProgress({ completed, total, currentTask: task });
        },
        partyBackground,
        fabricEmphasis
      );
      
      if (results.length === 0) {
        throw new Error("No images were successfully generated.");
      }

      const newItem: HistoryItem = {
        id: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        referenceImages: base64Array,
        productType: productType,
        poseStyle: poseStyle,
        backgroundStyle: backgroundStyle,
        partyBackground: partyBackground,
        fabricEmphasis: fabricEmphasis,
        results: results
      };

      // Save to IndexedDB
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).add(newItem);
      
      setGeneratedImages(results);
      setHistory(prev => [newItem, ...prev]);
      setState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during the photoshoot.");
      setState(AppState.UPLOAD);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleReset = () => {
    setReferenceImages([]);
    setGeneratedImages([]);
    setState(AppState.UPLOAD);
    setErrorMsg(null);
  };

  const handleToggleHistory = () => {
    setState(prev => prev === AppState.HISTORY ? AppState.UPLOAD : AppState.HISTORY);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setReferenceImages(item.referenceImages);
    setGeneratedImages(item.results);
    setState(AppState.RESULTS);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      <Header 
        onViewHistory={handleToggleHistory} 
        onGoHome={handleReset}
        hasHistory={history.length > 0}
      />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {errorMsg && (
          <div className="mb-8 mx-auto max-w-2xl bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
             <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
             <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {state === AppState.CHECKING_KEY && (
          <div className="max-w-md mx-auto text-center space-y-8 mt-10">
            <div className="w-24 h-24 bg-zinc-900 rounded-3xl mx-auto flex items-center justify-center border border-zinc-800">
              <KeyRound className="w-10 h-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic">Access Required</h2>
              <p className="text-zinc-400">To use Lumière high-fidelity Gemini 3 Pro models, please select a billing-enabled API key.</p>
            </div>
            <div className="space-y-4">
              <Button onClick={handleSelectKey} fullWidth>Select API Key</Button>
              <p className="text-xs text-zinc-600">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-zinc-400">View billing documentation</a>
              </p>
            </div>
          </div>
        )}

        {state === AppState.HISTORY && (
          <HistoryView items={history} onSelectItem={handleSelectHistoryItem} onDeleteItem={handleDeleteHistoryItem} onBack={handleReset} />
        )}

        {state === AppState.UPLOAD && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase italic">
                GY's LUMIÈRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">STUDIO</span>
              </h1>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
                Transform single or multiple reference images into professional catalogs. <br className="hidden md:block" />
                Select your product category and provide multi-angle shots for precision results.
              </p>
            </div>
            <UploadZone onImagesReady={handleImagesSelected} />
          </div>
        )}

        {state === AppState.GENERATING && (
          <div className="max-w-2xl mx-auto text-center mt-12 space-y-10 animate-in zoom-in-95 duration-500">
            <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              {referenceImages.length > 0 && (
                <img 
                  src={referenceImages[0]} 
                  alt="Reference" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl scale-125" 
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                <Loader2 className="w-16 h-16 text-white animate-spin mb-8" />
                <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">In Production</h3>
                <p className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase mb-10">{progress.currentTask}</p>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-white transition-all duration-1000 ease-in-out" style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
                </div>
                <div className="flex justify-between w-full text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-bold">
                   <span>Developing</span>
                   <span>{progress.completed} / {progress.total} Shots</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.RESULTS && (
          <Gallery images={generatedImages} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;