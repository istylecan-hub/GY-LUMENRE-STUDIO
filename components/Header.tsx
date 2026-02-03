import React from 'react';
import { Camera, Zap, Clock, Rocket } from 'lucide-react';
import { ModelTier } from '../types';

interface HeaderProps {
  onViewHistory: () => void;
  onGoHome: () => void;
  hasHistory: boolean;
  selectedTier: ModelTier;
  onToggleTier: (tier: ModelTier) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onViewHistory, 
  onGoHome, 
  hasHistory,
  selectedTier,
  onToggleTier
}) => {
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
          
          <button 
            onClick={() => onToggleTier(selectedTier === 'PRO' ? 'FREE' : 'PRO')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-bold uppercase tracking-wide
              ${selectedTier === 'PRO' 
                ? 'bg-yellow-900/30 border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                : 'bg-emerald-900/30 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/50 shadow-[0_0_15px_rgba(52,211,153,0.2)]'}
            `}
            title={`Switch to ${selectedTier === 'PRO' ? 'Free' : 'Pro'} Model`}
          >
            {selectedTier === 'PRO' ? (
              <>
                <Zap className="w-3 h-3 fill-current" />
                <span>⚡ Gemini 3 Pro (Paid)</span>
              </>
            ) : (
              <>
                <Rocket className="w-3 h-3" />
                <span>🚀 Flash 2.5 (Free)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};