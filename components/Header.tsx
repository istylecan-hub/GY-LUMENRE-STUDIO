import React from 'react';
import { Camera, Zap, Clock } from 'lucide-react';

interface HeaderProps {
  onViewHistory: () => void;
  onGoHome: () => void;
  hasHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onViewHistory, onGoHome, hasHistory }) => {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onGoHome}
        >
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            GY's LUMIÈRE <span className="text-zinc-500 font-normal">STUDIO</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {hasHistory && (
            <button 
              onClick={onViewHistory}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Gemini 3 Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
};