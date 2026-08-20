import React from 'react';
import { StyleAnalysisResult } from '../types';
import { Sparkles, Palette, Activity, BookOpen, X, Check } from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: StyleAnalysisResult | null;
  isLoading: boolean;
  onApplyRecommendations?: (settings: any) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  onApplyRecommendations,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                AI Neural Gram Matrix & Style Critic
              </h3>
              <p className="text-xs text-slate-400">Powered by Gemini Multimodal Vision & Feature Layer Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mb-3 animate-bounce">
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200 mb-1">
              Analyzing Feature Maps & Gram Matrices...
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Evaluating brush stroke rhythm, spatial color correlation, and neural loss parameters.
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Movement & Context */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400">
                Art Movement & Lineage
              </span>
              <h4 className="font-bold text-sm text-slate-100 mt-0.5 mb-1.5">
                {analysis.artisticMovement}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.artHistoricalContext}
              </p>
            </div>

            {/* Dominant Palette Swatches */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5" /> Dominant Chromatic Palette
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {analysis.dominantPalette?.map((hex, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center text-center"
                  >
                    <div
                      className="w-full h-8 rounded-md mb-1.5 border border-white/10 shadow-sm"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="font-mono text-[10px] text-slate-300">{hex}</span>
                    <span className="text-[9px] text-slate-500 line-clamp-1">
                      {analysis.paletteNames?.[idx] || `Color ${idx + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Feature Representations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <Activity className="w-3.5 h-3.5" /> Brushstroke Flow
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.brushstrokeCharacteristics}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400 flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Gram Matrix Correlation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.textureGramMatrixSummary}
                </p>
              </div>
            </div>

            {/* Recommended Settings */}
            {analysis.recommendedSettings && (
              <div className="p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300">
                    Recommended Loss Hyperparameters
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {analysis.recommendedSettings.explanation}
                  </p>
                </div>
                {onApplyRecommendations && (
                  <button
                    onClick={() => onApplyRecommendations(analysis.recommendedSettings)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply Hyperparameters
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No analysis available.</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
