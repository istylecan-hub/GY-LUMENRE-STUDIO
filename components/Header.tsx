import React from 'react';
import { Camera, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <Camera className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">GY's LUMIÈRE <span className="text-zinc-500 font-normal">STUDIO</span></span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
             <Zap className="w-3 h-3 text-yellow-500" />
             <span>Gemini 3 Pro Vision</span>
           </div>
        </div>
      </div>
    </header>
  );
};