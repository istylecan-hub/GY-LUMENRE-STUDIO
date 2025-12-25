import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }
    
    // Check size (limit to 10MB approx)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size too large. Please use an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
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
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-zinc-950/50'}
          ${error ? 'border-red-500/50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
            {isDragging ? (
              <Upload className="w-8 h-8 text-white animate-bounce" />
            ) : (
              <ImageIcon className="w-8 h-8 text-zinc-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Upload Reference Photo</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">
              Drag & drop your original low-quality photo here, or click to browse.
            </p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          <Button onClick={() => fileInputRef.current?.click()}>
            Select Image
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-950/30 px-4 py-2 rounded-lg border border-red-900/50">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="mt-4 pt-6 border-t border-zinc-800 w-full">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Best Results With</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400">
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">Full Body Shot</div>
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">Clear Lighting</div>
              <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">Simple Background</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
