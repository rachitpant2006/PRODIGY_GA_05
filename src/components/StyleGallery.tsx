import React, { useRef } from 'react';
import { STYLE_PRESETS } from '../data/presets';
import { StylePreset } from '../types';
import { Palette, Upload, Check, Info } from 'lucide-react';

interface StyleGalleryProps {
  selectedStyle: StylePreset;
  onSelectStyle: (style: StylePreset) => void;
  customStyleImage: string | null;
  onCustomStyleUpload: (imageSrc: string, name: string) => void;
  onOpenAnalysis: () => void;
}

export const StyleGallery: React.FC<StyleGalleryProps> = ({
  selectedStyle,
  onSelectStyle,
  customStyleImage,
  onCustomStyleUpload,
  onOpenAnalysis,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          onCustomStyleUpload(src, file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900/70 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100">Step 2: Choose Artistic Style</h2>
            <p className="text-xs text-slate-400">Select a master painting or upload custom artwork</p>
          </div>
        </div>

        <button
          id="btn-analyze-art-style"
          onClick={onOpenAnalysis}
          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg border border-indigo-800/60 transition-colors"
          title="AI Neural Gram Matrix & Art Breakdown"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Style Critic</span>
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 mb-3.5">
        {STYLE_PRESETS.map((style) => {
          const isSelected = selectedStyle.id === style.id;
          return (
            <button
              key={style.id}
              id={`style-preset-${style.id}`}
              onClick={() => onSelectStyle(style)}
              className={`group relative rounded-xl overflow-hidden text-left border transition-all flex flex-col ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/60'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={style.thumbnailUrl}
                  alt={style.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                {/* Palette indicator dots */}
                <div className="absolute bottom-1.5 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-sm border border-white/10">
                  {style.palette.slice(0, 3).map((hex, idx) => (
                    <span
                      key={idx}
                      className="w-2 h-2 rounded-full border border-white/20"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-xs text-slate-200 line-clamp-1 group-hover:text-white">
                    {style.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{style.artist}</p>
                </div>
                <span className="mt-1 text-[10px] font-medium text-indigo-300/90 line-clamp-1">
                  {style.movement}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Upload Bar & Selected Details */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
            <img
              src={selectedStyle.thumbnailUrl}
              alt="Selected style"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              Active: {selectedStyle.title} ({selectedStyle.artist})
            </p>
            <p className="text-[11px] text-slate-400 truncate">{selectedStyle.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            id="btn-upload-custom-style"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Art Style</span>
          </button>
        </div>
      </div>
    </div>
  );
};
