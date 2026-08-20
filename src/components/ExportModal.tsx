import React, { useState, useRef } from 'react';
import { Download, Frame, Image as ImageIcon, Layers, X, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultImgSrc: string;
  contentImgSrc: string;
  styleImgSrc: string;
  styleTitle: string;
  artistName: string;
  contentTitle: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resultImgSrc,
  contentImgSrc,
  styleImgSrc,
  styleTitle,
  artistName,
  contentTitle,
}) => {
  const [exportFormat, setExportFormat] = useState<'pure' | 'framed' | 'triple'>('framed');
  const [frameStyle, setFrameStyle] = useState<'museum-gold' | 'minimal-dark' | 'gallery-white'>('museum-gold');
  const [customArtworkTitle, setCustomArtworkTitle] = useState(`${contentTitle} in the style of ${styleTitle}`);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (exportFormat === 'pure') {
      const link = document.createElement('a');
      link.download = `neural-style-${Date.now()}.png`;
      link.href = resultImgSrc;
      link.click();
      onClose();
      return;
    }

    // Render framed or triple view into high-resolution export canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const resultImg = new Image();
    resultImg.crossOrigin = 'anonymous';
    resultImg.src = resultImgSrc;
    await new Promise((r) => (resultImg.onload = r));

    if (exportFormat === 'framed') {
      const artW = 1200;
      const artH = Math.round(artW * (resultImg.height / resultImg.width));
      const border = 120;
      const placardH = 140;

      canvas.width = artW + border * 2;
      canvas.height = artH + border * 2 + placardH;

      // Frame background
      if (frameStyle === 'museum-gold') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#d4af37');
        grad.addColorStop(0.5, '#f5d77f');
        grad.addColorStop(1, '#aa820a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Inner matte board
        ctx.fillStyle = '#1c1b18';
        ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
      } else if (frameStyle === 'minimal-dark') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#020617';
        ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
      }

      // Draw artwork
      ctx.drawImage(resultImg, border, border, artW, artH);

      // Placard Text
      const textY = artH + border + 60;
      ctx.textAlign = 'center';
      ctx.fillStyle = frameStyle === 'gallery-white' ? '#0f172a' : '#f8fafc';
      ctx.font = 'bold 32px serif';
      ctx.fillText(customArtworkTitle, canvas.width / 2, textY);

      ctx.font = 'italic 22px sans-serif';
      ctx.fillStyle = frameStyle === 'gallery-white' ? '#64748b' : '#94a3b8';
      ctx.fillText(
        `Neural Style Transfer (Gatys Loss Optimization) • Inspired by ${artistName}`,
        canvas.width / 2,
        textY + 40
      );
    } else if (exportFormat === 'triple') {
      const [contentImg, styleImg] = await Promise.all([
        new Promise<HTMLImageElement>((r) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = contentImgSrc;
          img.onload = () => r(img);
        }),
        new Promise<HTMLImageElement>((r) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = styleImgSrc;
          img.onload = () => r(img);
        }),
      ]);

      const subW = 550;
      const subH = 400;
      canvas.width = subW * 3 + 80;
      canvas.height = subH + 180;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw header
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Neural Style Transfer • Comparative Analysis', canvas.width / 2, 55);

      // Draw 3 images
      ctx.drawImage(contentImg, 30, 90, subW, subH);
      ctx.drawImage(styleImg, 30 + subW + 10, 90, subW, subH);
      ctx.drawImage(resultImg, 30 + subW * 2 + 20, 90, subW, subH);

      // Labels
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('1. Content Representation', 30 + subW / 2, subH + 130);
      ctx.fillStyle = '#818cf8';
      ctx.fillText(`2. Style (${styleTitle})`, 30 + subW + 10 + subW / 2, subH + 130);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('3. Synthesized Masterpiece', 30 + subW * 2 + 20 + subW / 2, subH + 130);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `neural-masterpiece-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-xl w-full rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Export & Museum Framing</h3>
              <p className="text-xs text-slate-400">Select presentation format for high-resolution download</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <button
            onClick={() => setExportFormat('pure')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              exportFormat === 'pure'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-xs font-semibold">Pure Artwork</span>
          </button>

          <button
            onClick={() => setExportFormat('framed')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              exportFormat === 'framed'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Frame className="w-5 h-5" />
            <span className="text-xs font-semibold">Gallery Framed</span>
          </button>

          <button
            onClick={() => setExportFormat('triple')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              exportFormat === 'triple'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-xs font-semibold">Comparative Card</span>
          </button>
        </div>

        {/* Framing Controls */}
        {exportFormat === 'framed' && (
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Artwork Title Placard
              </label>
              <input
                type="text"
                value={customArtworkTitle}
                onChange={(e) => setCustomArtworkTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Frame Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFrameStyle('museum-gold')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    frameStyle === 'museum-gold'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Museum Gold
                </button>
                <button
                  onClick={() => setFrameStyle('minimal-dark')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    frameStyle === 'minimal-dark'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Minimal Dark
                </button>
                <button
                  onClick={() => setFrameStyle('gallery-white')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    frameStyle === 'gallery-white'
                      ? 'bg-slate-200 text-slate-900 border-white'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Gallery White
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> Download High-Res PNG
          </button>
        </div>
      </div>
    </div>
  );
};
