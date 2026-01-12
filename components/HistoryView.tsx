import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, Calendar, ChevronRight, Layers, Tag, Sparkles } from 'lucide-react';

interface HistoryViewProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ items, onSelectItem, onDeleteItem, onBack }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
          <Calendar className="w-8 h-8 text-zinc-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">No history yet</h3>
          <p className="text-zinc-400 max-w-xs mx-auto">Your generated photoshoots will appear here for you to revisit.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-white underline underline-offset-4 hover:text-zinc-300"
        >
          Back to Generator
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Studio Archive</h2>
        <button 
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Back to Generator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
          <div 
            key={item.id}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
          >
            <div className="aspect-[16/9] relative overflow-hidden">
              <img 
                src={item.referenceImages[0]} 
                alt="Reference" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {item.referenceImages.length > 1 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    <Layers className="w-3 h-3" />
                    <span>{item.referenceImages.length} Refs</span>
                  </div>
                )}
                {item.productType && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100/10 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    <span>{item.productType}</span>
                  </div>
                )}
                {item.poseStyle && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/20 backdrop-blur-md rounded border border-indigo-500/30 text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.poseStyle}</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Session Data</p>
                  <p className="text-white font-medium text-sm">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="text-[10px] font-black bg-white text-black px-2 py-1 rounded">
                  {item.results.length} SHOTS
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between bg-zinc-900">
              <button 
                onClick={() => onSelectItem(item)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Open Studio <ChevronRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                title="Purge session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};