import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, X, Loader2, Package } from 'lucide-react';
import { Button } from './Button';
import JSZip from 'jszip';

interface GalleryProps {
  images: GeneratedImage[];
  onReset: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onReset }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleDownload = async (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (isZipping) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folderName = `lumiere_set_${new Date().toISOString().slice(0, 10)}`;
      const folder = zip.folder(folderName);

      images.forEach((img) => {
        // img.url is "data:image/png;base64,..."
        // We need to strip the prefix to get the raw base64 data for JSZip
        const base64Data = img.url.split(',')[1];
        if (base64Data && folder) {
            const cleanLabel = img.label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            const filename = `${cleanLabel}.png`;
            folder.file(filename, base64Data, { base64: true });
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate zip", error);
      alert("Failed to generate zip file. Please try downloading images individually.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Photoshoot Results</h2>
          <p className="text-zinc-400">Generated {images.length} high-fidelity studio shots.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onReset}>
            New Shoot
          </Button>
          <Button onClick={handleDownloadAll} disabled={isZipping}>
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Zipping...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Download Zip
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="group relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <img 
              src={img.url} 
              alt={img.label} 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white font-medium text-sm mb-2">{img.label}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedImage(img)}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 text-white transition-colors"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownload(img.url, `${img.label}.png`)}
                  className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-full max-h-full flex flex-col items-center">
             <img 
               src={selectedImage.url} 
               alt={selectedImage.label} 
               className="max-h-[85vh] w-auto rounded-lg shadow-2xl"
             />
             <div className="mt-6 flex items-center gap-4">
                <span className="text-white font-medium text-lg">{selectedImage.label}</span>
                <Button onClick={() => handleDownload(selectedImage.url, `${selectedImage.label}.png`)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download High-Res
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};