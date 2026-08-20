import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '../types';
import { IterationStats } from '../utils/neuralEngine';
import {
  Columns,
  Maximize2,
  Download,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

interface CanvasViewerProps {
  contentImgSrc: string;
  styleImgSrc: string;
  resultImgSrc: string | null;
  heatmapImgSrc: string | null;
  stats: IterationStats | null;
  isProcessing: boolean;
  onOpenExport: () => void;
  selectedStyleTitle: string;
}

export const CanvasViewer: React.FC<CanvasViewerProps> = ({
  contentImgSrc,
  styleImgSrc,
  resultImgSrc,
  heatmapImgSrc,
  stats,
  isProcessing,
  onOpenExport,
  selectedStyleTitle,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [splitPos, setSplitPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePointerDown = () => setIsDraggingSplit(true);
  const handlePointerUp = () => setIsDraggingSplit(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSplitPos(percent);
  };

  const handleCopyLink = async () => {
    try {
      if (resultImgSrc) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900/70 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col h-full">
      {/* Header with View Mode switchers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Stylized Canvas Result</span>
              {resultImgSrc && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {resultImgSrc
              ? `Re-synthesized in the aesthetic of ${selectedStyleTitle}`
              : 'Execute transfer to generate your stylized artwork'}
          </p>
        </div>

        {/* View Mode Toolbar */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            id="view-mode-split-btn"
            onClick={() => setViewMode('split')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split comparison slider"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split Slider</span>
          </button>

          <button
            id="view-mode-side-btn"
            onClick={() => setViewMode('side-by-side')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side-by-side triple view"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Side-by-Side</span>
          </button>

          <button
            id="view-mode-heatmap-btn"
            onClick={() => setViewMode('heatmap')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'heatmap'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Difference & Texture Heatmap"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Heatmap</span>
          </button>

          <button
            id="view-mode-single-btn"
            onClick={() => setViewMode('single')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'single'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Masterpiece focus"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Output Focus</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative flex-1 min-h-[380px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 flex items-center justify-center select-none shadow-inner"
      >
        {/* Loading / Optimizing state overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 relative">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/60 border-t-transparent animate-spin" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm mb-1">
              Neural Network Optimization in Progress
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-3">
              Calculating Gram matrix feature representations and minimizing perceptual loss...
            </p>
            {stats && (
              <div className="w-full max-w-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-400">Step {stats.iteration} / {stats.totalIterations}</span>
                  <span className="font-mono text-amber-400">Loss: {stats.totalLoss}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-100"
                    style={{ width: `${(stats.iteration / stats.totalIterations) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Mode: Split Slider */}
        {viewMode === 'split' && (
          <div className="relative w-full h-full min-h-[360px] flex items-center justify-center p-2">
            {resultImgSrc ? (
              <div className="relative max-w-full max-h-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                {/* Background: Stylized Result */}
                <img
                  src={resultImgSrc}
                  alt="Stylized Output"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Foreground: Original Content Image with clip path */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                >
                  <img
                    src={contentImgSrc}
                    alt="Original Content"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Draggable Divider Handle */}
                <div
                  onPointerDown={handlePointerDown}
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center group shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Columns className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-emerald-400 border border-white/10 pointer-events-none">
                  Original Content
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-amber-400 border border-white/10 pointer-events-none">
                  Stylized Output
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <img
                  src={contentImgSrc}
                  alt="Content Preview"
                  referrerPolicy="no-referrer"
                  className="max-h-[300px] mx-auto rounded-xl border border-slate-800 opacity-70 mb-3"
                />
                <p className="text-xs text-slate-400">
                  Click <strong className="text-indigo-400">Execute Transfer</strong> to view split comparison
                </p>
              </div>
            )}
          </div>
        )}

        {/* View Mode: Side-by-Side */}
        {viewMode === 'side-by-side' && (
          <div className="w-full h-full p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center justify-center">
            {/* Content Box */}
            <div className="flex flex-col items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-emerald-400 mb-2">1. Content Image</span>
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40">
                <img
                  src={contentImgSrc}
                  alt="Content"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Style Box */}
            <div className="flex flex-col items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-indigo-400 mb-2">2. Style Artwork</span>
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40">
                <img
                  src={styleImgSrc}
                  alt="Style"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="flex flex-col items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-amber-400 mb-2">3. Stylized Masterpiece</span>
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                {resultImgSrc ? (
                  <img
                    src={resultImgSrc}
                    alt="Result"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-500">Pending Execution</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Difference Heatmap */}
        {viewMode === 'heatmap' && (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center">
            {heatmapImgSrc ? (
              <div className="relative max-h-[340px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={heatmapImgSrc}
                  alt="Neural Style Difference Heatmap"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">Style Shift Heatmap:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">Preserved Content</span>
                    <div className="w-20 h-2 rounded bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600" />
                    <span className="text-red-400">High Style Transformation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <Activity className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">
                  Execute the transfer first to compute the neural difference heatmap
                </p>
              </div>
            )}
          </div>
        )}

        {/* View Mode: Single Fullscreen Focus */}
        {viewMode === 'single' && (
          <div className="w-full h-full p-4 flex items-center justify-center">
            {resultImgSrc ? (
              <div className="relative max-h-[360px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={resultImgSrc}
                  alt="Masterpiece Focus"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <img
                src={contentImgSrc}
                alt="Original Content"
                referrerPolicy="no-referrer"
                className="max-h-[300px] rounded-xl border border-slate-800 opacity-60"
              />
            )}
          </div>
        )}
      </div>

      {/* Loss & Output Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3.5 pt-3 border-t border-slate-800/80">
        {/* Convergence Metrics */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {stats ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                L_content: <strong className="text-slate-200">{stats.contentLoss}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                L_style: <strong className="text-slate-200">{stats.styleLoss}</strong>
              </span>
              <span className="font-mono text-indigo-400">
                L_total: {stats.totalLoss}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">
              VGG-19 Layer Feature Convergence: Ready
            </span>
          )}
        </div>

        {/* Actions (Export, Share, Download) */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            id="btn-copy-share"
            onClick={handleCopyLink}
            disabled={!resultImgSrc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 disabled:opacity-40 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            id="btn-open-export-modal"
            onClick={onOpenExport}
            disabled={!resultImgSrc}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download & Framing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
