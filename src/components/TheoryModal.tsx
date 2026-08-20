import React from 'react';
import { BookOpen, Layers, Cpu, Sparkles, X } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Neural Style Transfer • Foundations & Mechanics
              </h3>
              <p className="text-xs text-slate-400">Deep Learning Art Synthesis & Feature Reconstruction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* 1. Core Objective */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-amber-400 flex items-center gap-1.5 mb-2">
              <Layers className="w-4 h-4" /> 1. The Core Formulation (Gatys et al., 2015)
            </h4>
            <p className="mb-2">
              Neural Style Transfer separates and recombines the <strong>content</strong> of one image with the <strong>style</strong> of another using deep convolutional neural networks (typically VGG-19).
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-indigo-300 border border-slate-800 mb-2">
              {'L_total(p, a, x) = α · L_content(p, x) + β · L_style(a, x)'}
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">p</strong>: Original Content Image</li>
              <li><strong className="text-slate-200">a</strong>: Artistic Style Image</li>
              <li><strong className="text-slate-200">x</strong>: The generated stylized canvas</li>
              <li><strong className="text-slate-200">α, β</strong>: Weighting factors for content vs style loss</li>
            </ul>
          </div>

          {/* 2. Content Representation vs Style Gram Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <h5 className="font-bold text-xs text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Content Loss L_content
              </h5>
              <p className="text-slate-400 mb-2">
                Extracted from deeper layers (e.g. <code>conv4_2</code>). Captures higher-level spatial arrangement and semantic objects while discarding pixel-exact colors.
              </p>
              <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300">
                {'L_content = 0.5 * Σ (F_ij^l - P_ij^l)²'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <h5 className="font-bold text-xs text-purple-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Style Loss & Gram Matrix G
              </h5>
              <p className="text-slate-400 mb-2">
                Computed across multiple conv layers (<code>conv1_1</code> through <code>conv5_1</code>). The Gram matrix measures spatial correlation between filter activations (textures, brushwork, grain).
              </p>
              <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300">
                {'G_ij^l = Σ_k (F_ik^l · F_jk^l)'}
              </div>
            </div>
          </div>

          {/* 3. Real-time AdaIN & Flow Synthesizer */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-indigo-400 mb-2">
              2. Real-Time AdaIN Normalization & Brush Flow Fields
            </h4>
            <p className="text-slate-300 mb-2">
              For real-time browser execution, Adaptive Instance Normalization (AdaIN) dynamically aligns the mean and standard deviation of feature distributions between style and content channels:
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800 mb-2">
              {'AdaIN(x, y) = σ(y) · ((x - μ(x)) / σ(x)) + μ(y)'}
            </div>
            <p className="text-slate-400">
              Coupled with Sobel tensor gradient flow fields and Kuwahara multi-quadrant filtering, the engine abstracts the photo into brushwork trajectories following the contours of the original scene.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Got it, Let's Create!
          </button>
        </div>
      </div>
    </div>
  );
};
