import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, X, Plus, Shirt, Check, Sparkles, Moon, Camera, Grip, Zap, Box, LayoutTemplate, Coffee, Trees, Building2, Armchair, Wine, Building, Sofa, ShieldCheck, Layers, Star, Palette } from 'lucide-react';
import { Button } from './Button';
import { ProductType, PoseStyle, BackgroundStyle, PartyBackgroundType, FabricEmphasisType } from '../types';
import { PRODUCT_PRESETS } from '../constants';

interface UploadZoneProps {
  onImagesReady: (
    base64Array: string[], 
    productType: ProductType, 
    poseStyle: PoseStyle, 
    backgroundStyle: BackgroundStyle, 
    selectedPoseIds: string[],
    partyBackground?: PartyBackgroundType,
    fabricEmphasis?: FabricEmphasisType
  ) => void;
}

const PRODUCT_OPTIONS: { id: ProductType; label: string; desc: string }[] = [
  { id: 'TOPS', label: 'Tops / Tees', desc: 'Focus on neckline, sleeves, and upper body fit.' },
  { id: 'DRESSES', label: 'Dresses', desc: 'Full body flow, silhouette, and length.' },
  { id: 'COORDS', label: 'Co-ord Sets', desc: 'Matching sets with top and bottom focus.' },
  { id: 'KURTI', label: 'Kurti / Tunic', desc: 'Ethnic wear details, side cuts, and yokes.' },
];

const STYLE_OPTIONS: { id: PoseStyle; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'COMMERCIAL', label: 'Commercial', desc: 'Clean, approachable, e-commerce standard.', icon: Sparkles },
  { id: 'EDITORIAL', label: 'Editorial', desc: 'High fashion, dramatic angles, serious.', icon: Sparkles },
  { id: 'CASUAL', label: 'Relaxed', desc: 'Natural movement, candid, lifestyle vibe.', icon: Sparkles },
  { id: 'STREET_STYLE', label: 'Street Style', desc: 'Gen-Z, cool, dynamic, urban vibes.', icon: Zap },
  { id: 'GLAMOROUS', label: 'Glamorous', desc: 'Luxury, confident, captivating elegance.', icon: Sparkles },
  { id: 'URBAN_NIGHT', label: 'Urban Night', desc: 'Flash-lit rooftop editorial. (Dresses/Tops/Coords)', icon: Moon },
];

const BACKGROUND_OPTIONS: { id: BackgroundStyle; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'STUDIO_GREY', label: 'Studio Grey', desc: 'Professional e-commerce. Neutral.', icon: Box },
  { id: 'STUDIO_WHITE', label: 'Studio White', desc: 'High-key pure white. Crisp.', icon: LayoutTemplate },
  { id: 'STUDIO_BEIGE', label: 'Warm Beige', desc: 'Minimalist latte tones. Soft.', icon: Coffee },
  { id: 'STUDIO_COLORS', label: 'Color Pop', desc: 'Vibrant, high-saturation creative studio.', icon: Palette },
  { id: 'OUTDOOR_NATURE', label: 'Outdoor', desc: 'Blurred park/garden. Natural light.', icon: Trees },
  { id: 'URBAN_STREET', label: 'Street (Day)', desc: 'City vibes, concrete, daylight.', icon: Building2 },
  { id: 'STREET_STYLE', label: 'Street Fashion', desc: 'Trendy, textured walls, modern urban.', icon: Zap },
  { id: 'URBAN_NIGHT', label: 'Urban Night', desc: 'Neon lights, city bokeh, cinematic night.', icon: Moon },
  { id: 'LUXURY_INTERIOR', label: 'Luxury', desc: 'High-end interior ambiance.', icon: Armchair },
];

const PARTY_OPTIONS: { id: PartyBackgroundType; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'CLUB_LOUNGE', label: 'Club Lounge', desc: 'Indoor party, neon, dark.', icon: Wine },
  { id: 'ROOFTOP_PARTY', label: 'Rooftop Lights', desc: 'String lights, city view.', icon: Building },
  { id: 'PENTHOUSE_PARTY', label: 'Penthouse', desc: 'Luxury house party, warm.', icon: Sofa },
  { id: 'MINIMAL_PARTY', label: 'Minimal (Safe)', desc: 'Dark neutral, soft bokeh.', icon: ShieldCheck },
  { id: 'URBAN_NIGHT_CITY', label: 'Urban Night', desc: 'Neon city, bokeh, cinematic.', icon: Moon },
];

const FABRIC_OPTIONS: { id: FabricEmphasisType; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'TEXTURE_BOOST', label: 'Texture Boost', desc: 'Enhance ribs, knits & weave.', icon: Layers },
  { id: 'SPARKLE_HIGHLIGHT', label: 'Sparkle Highlight', desc: 'Shine & gloss (Best with Flash).', icon: Star },
];

const MAX_IMAGES = 10;

export const UploadZone: React.FC<UploadZoneProps> = ({ onImagesReady }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<ProductType>('TOPS');
  const [selectedStyle, setSelectedStyle] = useState<PoseStyle>('COMMERCIAL');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundStyle>('STUDIO_GREY');
  const [selectedPartyBackground, setSelectedPartyBackground] = useState<PartyBackgroundType | undefined>(undefined);
  const [selectedFabricEmphasis, setSelectedFabricEmphasis] = useState<FabricEmphasisType | undefined>(undefined);
  const [selectedPoseIds, setSelectedPoseIds] = useState<string[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Initialize selectedPoseIds when selectedType changes
  useEffect(() => {
    const defaultPoses = PRODUCT_PRESETS[selectedType].map(p => p.id);
    setSelectedPoseIds(defaultPoses);
  }, [selectedType]);

  // Effect to reset incompatible styles when product type changes
  useEffect(() => {
    if (selectedStyle === 'URBAN_NIGHT' && selectedType === 'KURTI') {
      setSelectedStyle('COMMERCIAL');
    }
  }, [selectedType, selectedStyle]);

  // Reset party background if style changes from Urban Night
  useEffect(() => {
    if (selectedStyle !== 'URBAN_NIGHT') {
      setSelectedPartyBackground(undefined);
    }
  }, [selectedStyle]);

  const processFiles = (files: FileList | File[]) => {
    setError(null);
    const newFiles = Array.from(files);
    
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed.");
        return false;
      }
      // Individual file limit 10MB
      if (file.size > 10 * 1024 * 1024) {
        setError("Some images are too large (max 10MB per image).");
        return false;
      }
      return true;
    });

    const promises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64s => {
      setPreviews(prev => [...prev, ...base64s].slice(0, MAX_IMAGES));
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const togglePose = (poseId: string) => {
    setSelectedPoseIds(prev => {
      if (prev.includes(poseId)) {
        return prev.filter(id => id !== poseId);
      } else {
        return [...prev, poseId];
      }
    });
  };

  const handleStartGeneration = () => {
    if (previews.length > 0 && selectedPoseIds.length > 0) {
      onImagesReady(
        previews, 
        selectedType, 
        selectedStyle, 
        selectedBackground, 
        selectedPoseIds,
        selectedPartyBackground,
        selectedFabricEmphasis
      );
    } else if (selectedPoseIds.length === 0) {
      setError("Please select at least one shot angle.");
    }
  };

  const isStyleDisabled = (styleId: PoseStyle) => {
    if (styleId === 'URBAN_NIGHT') {
      return selectedType === 'KURTI';
    }
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Step 1: Category Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">1. Select Product Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRODUCT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedType(opt.id)}
              className={`
                relative p-4 rounded-xl border text-left transition-all duration-200 group
                ${selectedType === opt.id 
                  ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900'}
              `}
            >
              {selectedType === opt.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
              <div className="mb-2">
                <Shirt className={`w-6 h-6 ${selectedType === opt.id ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              </div>
              <div className="font-bold text-sm mb-1">{opt.label}</div>
              <div className={`text-[10px] leading-tight ${selectedType === opt.id ? 'text-zinc-600' : 'text-zinc-500'}`}>
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Mood Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">2. Select Pose Mood</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STYLE_OPTIONS.map((opt) => {
            const disabled = isStyleDisabled(opt.id);
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => !disabled && setSelectedStyle(opt.id)}
                disabled={disabled}
                className={`
                  relative p-4 rounded-xl border text-left transition-all duration-200 group
                  ${disabled 
                    ? 'opacity-40 cursor-not-allowed bg-zinc-950 border-zinc-900 text-zinc-600'
                    : selectedStyle === opt.id 
                      ? 'bg-zinc-100 border-zinc-100 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900'}
                `}
              >
                {selectedStyle === opt.id && !disabled && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
                <div className="mb-2">
                  <Icon className={`w-5 h-5 ${selectedStyle === opt.id && !disabled ? 'text-black' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                </div>
                <div className="font-bold text-sm mb-1">{opt.label}</div>
                <div className={`text-[10px] leading-tight ${selectedStyle === opt.id && !disabled ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Background Selection - Conditional */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">3. Select Background</h3>
        
        {/* Standard Backgrounds - Only show if NOT Urban Night (or user can switch back) */}
        {selectedStyle !== 'URBAN_NIGHT' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-in fade-in duration-300">
            {BACKGROUND_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedBackground === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedBackground(opt.id)}
                  className={`
                    relative p-4 rounded-xl border text-left transition-all duration-200 group
                    ${isSelected 
                        ? 'bg-zinc-100 border-zinc-100 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                        : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                  <div className="mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  </div>
                  <div className="font-bold text-sm mb-1">{opt.label}</div>
                  <div className={`text-[10px] leading-tight ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Party Background Add-on Options for Urban Night */
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center justify-center gap-2 mb-4 text-purple-300 bg-purple-900/20 py-2 rounded-lg border border-purple-500/30">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Party Vibe Add-on Active</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {PARTY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedPartyBackground === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPartyBackground(isSelected ? undefined : opt.id)}
                    className={`
                      relative p-4 rounded-xl border text-left transition-all duration-200 group
                      ${isSelected 
                          ? 'bg-purple-100 border-purple-100 text-purple-950 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                          : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-purple-500/50 hover:bg-purple-900/10'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-purple-950" />
                      </div>
                    )}
                    <div className="mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-950' : 'text-zinc-600 group-hover:text-purple-400'}`} />
                    </div>
                    <div className="font-bold text-sm mb-1">{opt.label}</div>
                    <div className={`text-[10px] leading-tight ${isSelected ? 'text-purple-900/80' : 'text-zinc-500'}`}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
             </div>
             <p className="text-center text-xs text-zinc-500 mt-3">Select a vibe to refine the Urban Night look. Deselect to use standard Urban Night setting.</p>
          </div>
        )}
      </div>

       {/* Step 4: Fabric Emphasis Add-on */}
       <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">4. Fabric Emphasis (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {FABRIC_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedFabricEmphasis === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedFabricEmphasis(isSelected ? undefined : opt.id)}
                className={`
                  relative p-4 rounded-xl border text-left transition-all duration-200 group flex items-start gap-4
                  ${isSelected 
                    ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-indigo-500/30 hover:bg-indigo-900/10'}
                `}
              >
                 <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-indigo-400'}`}>
                    <Icon className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="font-bold text-sm mb-1">{opt.label}</div>
                    <div className="text-[11px] leading-tight opacity-70">
                      {opt.desc}
                    </div>
                 </div>
                 {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 5: Shot Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">5. Select Camera Angles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
          {PRODUCT_PRESETS[selectedType].map((pose) => (
             <button
               key={pose.id}
               onClick={() => togglePose(pose.id)}
               className={`
                 flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                 ${selectedPoseIds.includes(pose.id)
                   ? 'bg-zinc-800 border-zinc-600 text-white'
                   : 'bg-transparent border-zinc-800 text-zinc-500 hover:bg-zinc-900'}
               `}
             >
               <div className="flex items-center gap-3">
                  <div className={`
                    w-4 h-4 rounded border flex items-center justify-center
                    ${selectedPoseIds.includes(pose.id) ? 'bg-white border-white' : 'border-zinc-600'}
                  `}>
                    {selectedPoseIds.includes(pose.id) && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold">{pose.label}</span>
                  </div>
               </div>
             </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500 px-2">
           <button onClick={() => setSelectedPoseIds(PRODUCT_PRESETS[selectedType].map(p=>p.id))} className="hover:text-white">Select All</button>
           <button onClick={() => setSelectedPoseIds([])} className="hover:text-white">Clear All</button>
        </div>
      </div>

      {/* Step 6: Upload */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">6. Upload References</h3>
        <div 
          className={`
            relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
            ${isDragging ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-zinc-950/50'}
            ${error ? 'border-red-500/50' : ''}
            ${previews.length > 0 ? 'p-6' : 'p-12'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previews.length === 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                {isDragging ? (
                  <Upload className="w-8 h-8 text-white animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Upload Photos</h3>
                <p className="text-zinc-400 max-w-sm mx-auto text-sm">
                  Upload up to {MAX_IMAGES} photos (Front, Back, Detail) for best results.
                </p>
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleChange}
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              <Button onClick={() => fileInputRef.current?.click()}>
                Select Images
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative w-32 h-44 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 shadow-lg">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-[9px] text-white uppercase font-bold">
                      Ref {idx + 1}
                    </div>
                  </div>
                ))}
                {previews.length < MAX_IMAGES && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-44 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all text-zinc-500 hover:text-zinc-300"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-medium">Add Angle</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-4 pt-4">
                <Button onClick={handleStartGeneration} className="w-full max-w-md shadow-[0_0_20px_rgba(255,255,255,0.1)] h-12 text-lg">
                  Generate {selectedPoseIds.length} Shot{selectedPoseIds.length !== 1 ? 's' : ''}
                </Button>
                <button 
                  onClick={() => setPreviews([])}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest font-bold"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleChange}
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-950/30 px-4 py-2 rounded-lg border border-red-900/50 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};