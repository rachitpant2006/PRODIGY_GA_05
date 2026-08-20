import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ContentPicker } from './components/ContentPicker';
import { StyleGallery } from './components/StyleGallery';
import { ControlPanel } from './components/ControlPanel';
import { CanvasViewer } from './components/CanvasViewer';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { ExportModal } from './components/ExportModal';
import { TheoryModal } from './components/TheoryModal';

import { STYLE_PRESETS, SAMPLE_CONTENTS, DEFAULT_SETTINGS } from './data/presets';
import {
  StylePreset,
  ContentSample,
  TransferSettings,
  StyleAnalysisResult,
} from './types';
import {
  loadImage,
  executeNeuralStyleTransfer,
  generateDifferenceHeatmap,
  IterationStats,
} from './utils/neuralEngine';

export default function App() {
  const [selectedContent, setSelectedContent] = useState<ContentSample>(SAMPLE_CONTENTS[0]);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [customContentImg, setCustomContentImg] = useState<string | null>(null);
  const [customStyleImg, setCustomStyleImg] = useState<string | null>(null);

  const [settings, setSettings] = useState<TransferSettings>({
    ...DEFAULT_SETTINGS,
    ...STYLE_PRESETS[0].defaultConfig,
  });

  const [engineMode, setEngineMode] = useState<'neural-shader' | 'gemini-ai'>('neural-shader');
  const [resultImgSrc, setResultImgSrc] = useState<string | null>(null);
  const [heatmapImgSrc, setHeatmapImgSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stats, setStats] = useState<IterationStats | null>(null);

  // Modals
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<StyleAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Active content and style image URLs
  const activeContentSrc = customContentImg || selectedContent.imageSrc;
  const activeStyleSrc = customStyleImg || selectedStyle.imageSrc;

  // Handle Style Selection
  const handleSelectStyle = (preset: StylePreset) => {
    setSelectedStyle(preset);
    setCustomStyleImg(null);
    if (preset.defaultConfig) {
      setSettings((prev) => ({
        ...prev,
        ...preset.defaultConfig,
      }));
    }
  };

  // Handle Content Selection
  const handleSelectContent = (sample: ContentSample) => {
    setSelectedContent(sample);
    setCustomContentImg(null);
  };

  // Custom Uploads
  const handleCustomContentUpload = (src: string, title: string) => {
    setCustomContentImg(src);
    setSelectedContent({
      id: 'custom-content',
      title,
      category: 'Portrait',
      thumbnailUrl: src,
      imageSrc: src,
    });
  };

  const handleCustomStyleUpload = (src: string, name: string) => {
    setCustomStyleImg(src);
    setSelectedStyle({
      id: 'custom-style',
      title: name || 'Custom Art Style',
      artist: 'Custom Artist',
      year: 'Contemporary',
      movement: 'Custom Expression',
      thumbnailUrl: src,
      imageSrc: src,
      description: 'User uploaded reference style artwork.',
      promptGuidance: `Artistic style of ${name || 'the uploaded reference artwork'}`,
      defaultConfig: {},
      palette: ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });
  };

  // Auto-tune hyperparameters for selected masterpiece
  const handleAutoTune = () => {
    if (selectedStyle.defaultConfig) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...selectedStyle.defaultConfig,
      });
    }
  };

  // Reset to initial settings
  const handleResetDefaults = () => {
    setSelectedContent(SAMPLE_CONTENTS[0]);
    setSelectedStyle(STYLE_PRESETS[0]);
    setCustomContentImg(null);
    setCustomStyleImg(null);
    setSettings({
      ...DEFAULT_SETTINGS,
      ...STYLE_PRESETS[0].defaultConfig,
    });
  };

  // Execute Style Transfer (Client Neural Engine vs Gemini AI)
  const runTransfer = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (engineMode === 'gemini-ai') {
        // Call Server-Side Gemini endpoint
        const response = await fetch('/api/style-transfer/ai-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentImageBase64: activeContentSrc,
            styleImageBase64: activeStyleSrc,
            styleName: selectedStyle.title,
            stylePrompt: selectedStyle.promptGuidance,
            intensity: settings.styleStrength / 100,
          }),
        });

        const data = await response.json();

        if (data.success && data.imageUrl) {
          setResultImgSrc(data.imageUrl);
          const heatUrl = await generateDifferenceHeatmap(activeContentSrc, data.imageUrl);
          setHeatmapImgSrc(heatUrl);
        } else {
          // Fallback to high-performance local shader
          console.warn('AI endpoint fallback to neural shader:', data.fallbackReason || data.error);
          const [cImg, sImg] = await Promise.all([
            loadImage(activeContentSrc),
            loadImage(activeStyleSrc),
          ]);
          const stylizedDataUrl = await executeNeuralStyleTransfer(
            cImg,
            sImg,
            settings,
            800,
            (progressStats) => setStats(progressStats)
          );
          setResultImgSrc(stylizedDataUrl);
          const heatUrl = await generateDifferenceHeatmap(activeContentSrc, stylizedDataUrl);
          setHeatmapImgSrc(heatUrl);
        }
      } else {
        // High-Performance Client Neural Engine
        const [cImg, sImg] = await Promise.all([
          loadImage(activeContentSrc),
          loadImage(activeStyleSrc),
        ]);

        const stylizedDataUrl = await executeNeuralStyleTransfer(
          cImg,
          sImg,
          settings,
          800,
          (progressStats) => setStats(progressStats)
        );

        setResultImgSrc(stylizedDataUrl);
        const heatUrl = await generateDifferenceHeatmap(activeContentSrc, stylizedDataUrl);
        setHeatmapImgSrc(heatUrl);
      }
    } catch (err) {
      console.error('Style transfer execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [activeContentSrc, activeStyleSrc, selectedStyle, settings, engineMode, isProcessing]);

  // Style Feature Analysis with Gemini 3.7 Flash
  const handleOpenAnalysis = async () => {
    setIsAnalysisOpen(true);
    if (!analysisData) {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/style-transfer/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentImageBase64: activeContentSrc,
            styleImageBase64: activeStyleSrc,
            styleName: selectedStyle.title,
          }),
        });
        const data = await res.json();
        if (data.success && data.analysis) {
          setAnalysisData(data.analysis);
        }
      } catch (err) {
        console.error('Failed to analyze style:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Run initial stylization on mount
  const initialRunRef = useRef(false);
  useEffect(() => {
    if (!initialRunRef.current) {
      initialRunRef.current = true;
      runTransfer();
    }
  }, [runTransfer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        engineMode={engineMode}
        setEngineMode={setEngineMode}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onResetDefaults={handleResetDefaults}
        isProcessing={isProcessing}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Selection & Control Modules (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <ContentPicker
            selectedContent={selectedContent}
            onSelectContent={handleSelectContent}
            onCustomContentUpload={handleCustomContentUpload}
          />

          <StyleGallery
            selectedStyle={selectedStyle}
            onSelectStyle={handleSelectStyle}
            customStyleImage={customStyleImg}
            onCustomStyleUpload={handleCustomStyleUpload}
            onOpenAnalysis={handleOpenAnalysis}
          />

          <ControlPanel
            settings={settings}
            onChangeSettings={setSettings}
            onExecuteTransfer={runTransfer}
            isProcessing={isProcessing}
            engineMode={engineMode}
            onAutoTune={handleAutoTune}
          />
        </div>

        {/* Right Column: Interactive Canvas & Comparison Stage (7 cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <CanvasViewer
            contentImgSrc={activeContentSrc}
            styleImgSrc={activeStyleSrc}
            resultImgSrc={resultImgSrc}
            heatmapImgSrc={heatmapImgSrc}
            stats={stats}
            isProcessing={isProcessing}
            onOpenExport={() => setIsExportOpen(true)}
            selectedStyleTitle={selectedStyle.title}
          />
        </div>
      </main>

      {/* Footer info banner */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Neural Style Transfer Studio • Task-05 • Powered by VGG-19 Loss Optimization & Gemini Multimodal
          </span>
          <button
            onClick={() => setIsTheoryOpen(true)}
            className="text-indigo-400 hover:underline"
          >
            How it works (Mathematical Foundations)
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AiAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        analysis={analysisData}
        isLoading={isAnalyzing}
        onApplyRecommendations={(rec) => {
          if (rec.styleWeight === 'high') {
            setSettings((s) => ({ ...s, styleStrength: 90 }));
          } else if (rec.styleWeight === 'medium') {
            setSettings((s) => ({ ...s, styleStrength: 75 }));
          }
          if (rec.strokeScale === 'bold') {
            setSettings((s) => ({ ...s, brushScale: 12 }));
          } else if (rec.strokeScale === 'fine') {
            setSettings((s) => ({ ...s, brushScale: 5 }));
          }
          setIsAnalysisOpen(false);
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        resultImgSrc={resultImgSrc || ''}
        contentImgSrc={activeContentSrc}
        styleImgSrc={activeStyleSrc}
        styleTitle={selectedStyle.title}
        artistName={selectedStyle.artist}
        contentTitle={selectedContent.title}
      />

      <TheoryModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
}
