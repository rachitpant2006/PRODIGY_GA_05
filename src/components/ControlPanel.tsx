import React from 'react';
import { TransferSettings, ColorTransferMode } from '../types';
import { Sliders, Wand2, Play, Sparkles, RefreshCw, Zap } from 'lucide-react';

interface ControlPanelProps {
  settings: TransferSettings;
  onChangeSettings: (settings: TransferSettings) => void;
  onExecuteTransfer: () => void;
  isProcessing: boolean;
  engineMode: 'neural-shader' | 'gemini-ai';
  onAutoTune: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onChangeSettings,
  onExecuteTransfer,
  isProcessing,
  engineMode,
  onAutoTune,
}) => {
  const handleSlider = (key: keyof TransferSettings, val: number) => {
    onChangeSettings({
      ...settings,
      [key]: val,
    });
  };

  const handleColorMode = (mode: ColorTransferMode) => {
    onChangeSettings({
      ...settings,
      colorMode: mode,
    });
  };

  const applyQuickPreset = (preset: 'subtle' | 'balanced' | 'dramatic' | 'pure-style') => {
    if (preset === 'subtle') {
      onChangeSettings({
        ...settings,
        styleStrength: 50,
        contentWeight: 85,
        brushScale: 4,
        colorMode: 'balanced',
        textureImpasto: 35,
        contrast: 1.05,
      });
    } else if (preset === 'balanced') {
      onChangeSettings({
        ...settings,
        styleStrength: 80,
        contentWeight: 65,
        brushScale: 8,
        colorMode: 'style',
        textureImpasto: 60,
        contrast: 1.15,
      });
    } else if (preset === 'dramatic') {
      onChangeSettings({
        ...settings,
        styleStrength: 92,
        contentWeight: 50,
        brushScale: 12,
        colorMode: 'style',
        textureImpasto: 85,
        contrast: 1.3,
        vibrance: 1.4,
      });
    } else if (preset === 'pure-style') {
      onChangeSettings({
        ...settings,
        styleStrength: 100,
        contentWeight: 35,
        brushScale: 15,
        colorMode: 'style',
        textureImpasto: 95,
        contrast: 1.4,
        vibrance: 1.5,
      });
    }
  };

  return (
    <div className="bg-slate-900/70 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100">Step 3: Neural Hyperparameters</h2>
            <p className="text-xs text-slate-400">Balance content loss (α) versus style loss (β)</p>
          </div>
        </div>

        <button
          id="btn-autotune-settings"
          onClick={onAutoTune}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg transition-colors"
          title="Auto-tune hyperparameters for selected masterpiece"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Auto-Tune</span>
        </button>
      </div>

      {/* Quick Profile Presets */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-4 overflow-x-auto">
        <span className="text-[10px] uppercase font-bold text-slate-500 px-2 shrink-0">Profile:</span>
        <button
          onClick={() => applyQuickPreset('subtle')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
        >
          Subtle Tint
        </button>
        <button
          onClick={() => applyQuickPreset('balanced')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
        >
          Balanced Classic
        </button>
        <button
          onClick={() => applyQuickPreset('dramatic')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
        >
          Heavy Impasto
        </button>
        <button
          onClick={() => applyQuickPreset('pure-style')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
        >
          Abstract Dominant
        </button>
      </div>

      {/* Main Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Style Strength */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              Style Weight (β)
            </span>
            <span className="text-amber-400 font-mono font-semibold">{settings.styleStrength}%</span>
          </div>
          <input
            id="slider-style-strength"
            type="range"
            min="10"
            max="100"
            step="1"
            value={settings.styleStrength}
            onChange={(e) => handleSlider('styleStrength', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Subtle touch</span>
            <span>Intense abstraction</span>
          </div>
        </div>

        {/* Content Preservation */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Content Preservation (α)</span>
            <span className="text-emerald-400 font-mono font-semibold">{settings.contentWeight}%</span>
          </div>
          <input
            id="slider-content-weight"
            type="range"
            min="10"
            max="100"
            step="1"
            value={settings.contentWeight}
            onChange={(e) => handleSlider('contentWeight', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Stylized loose forms</span>
            <span>Sharp structure</span>
          </div>
        </div>

        {/* Brush Scale */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Brush Stroke Scale</span>
            <span className="text-indigo-400 font-mono font-semibold">{settings.brushScale} px</span>
          </div>
          <input
            id="slider-brush-scale"
            type="range"
            min="2"
            max="20"
            step="1"
            value={settings.brushScale}
            onChange={(e) => handleSlider('brushScale', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Fine pointillism</span>
            <span>Broad impasto dabs</span>
          </div>
        </div>

        {/* Texture & Impasto 3D Relief */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Impasto 3D Relief & Canvas Weave</span>
            <span className="text-purple-400 font-mono font-semibold">{settings.textureImpasto}%</span>
          </div>
          <input
            id="slider-texture-impasto"
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.textureImpasto}
            onChange={(e) => handleSlider('textureImpasto', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Flat digital canvas</span>
            <span>Thick oil relief</span>
          </div>
        </div>
      </div>

      {/* Color Mode Tabs */}
      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 mb-4">
        <label className="block text-xs font-medium text-slate-300 mb-2">
          Color Transfer Scheme (AdaIN)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleColorMode('style')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
              settings.colorMode === 'style'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Style Artwork Palette
          </button>
          <button
            onClick={() => handleColorMode('balanced')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
              settings.colorMode === 'balanced'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Harmonious Blend
          </button>
          <button
            onClick={() => handleColorMode('content')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
              settings.colorMode === 'content'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Original Photo Colors
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        id="btn-execute-style-transfer"
        onClick={onExecuteTransfer}
        disabled={isProcessing}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
          engineMode === 'gemini-ai'
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white shadow-purple-500/25'
            : 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-indigo-500/25'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>
              {engineMode === 'gemini-ai'
                ? 'Synthesizing with Gemini Multimodal AI...'
                : 'Iterating Neural Style Optimization...'}
            </span>
          </>
        ) : (
          <>
            {engineMode === 'gemini-ai' ? (
              <Sparkles className="w-4 h-4 text-amber-300" />
            ) : (
              <Zap className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {engineMode === 'gemini-ai'
                ? 'Generate AI Stylized Masterpiece (Gemini)'
                : 'Execute Instant Neural Style Transfer'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
