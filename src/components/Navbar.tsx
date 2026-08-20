import React from 'react';
import { Sparkles, Cpu, BookOpen, Layers, RefreshCw } from 'lucide-react';

interface NavbarProps {
  engineMode: 'neural-shader' | 'gemini-ai';
  setEngineMode: (mode: 'neural-shader' | 'gemini-ai') => void;
  onOpenTheory: () => void;
  onResetDefaults: () => void;
  isProcessing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  engineMode,
  setEngineMode,
  onOpenTheory,
  onResetDefaults,
  isProcessing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Neural Style Transfer <span className="text-amber-400 text-xs font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Task-05</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Apply artistic styles of masterpieces to content photos
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTheory}
            className="sm:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="How it Works"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Switcher & Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Dual Engine Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-medium">
            <button
              id="engine-mode-shader-btn"
              onClick={() => setEngineMode('neural-shader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                engineMode === 'neural-shader'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Real-time Neural Engine</span>
            </button>
            <button
              id="engine-mode-ai-btn"
              onClick={() => setEngineMode('gemini-ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                engineMode === 'gemini-ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini AI Synthesis</span>
            </button>
          </div>

          {/* Theory / Guide Button */}
          <button
            id="open-theory-btn"
            onClick={onOpenTheory}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>NST Science</span>
          </button>

          {/* Reset Defaults */}
          <button
            id="reset-defaults-btn"
            onClick={onResetDefaults}
            disabled={isProcessing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 disabled:opacity-50 transition-colors"
            title="Reset Settings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
