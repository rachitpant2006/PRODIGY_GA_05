export type ColorTransferMode = 'style' | 'content' | 'balanced';

export type BrushScaleMode = 'fine' | 'medium' | 'bold' | 'impasto';

export interface StylePreset {
  id: string;
  title: string;
  artist: string;
  year: string;
  movement: string;
  thumbnailUrl: string;
  imageSrc: string;
  description: string;
  promptGuidance: string;
  defaultConfig: Partial<TransferSettings>;
  palette: string[];
}

export interface ContentSample {
  id: string;
  title: string;
  category: 'Landscape' | 'Portrait' | 'Architecture' | 'Animals' | 'Objects';
  thumbnailUrl: string;
  imageSrc: string;
}

export interface TransferSettings {
  styleStrength: number; // 0 to 100
  contentWeight: number; // 0 to 100
  brushScale: number; // 1 to 24 px
  strokeCoherence: number; // 0 to 100
  colorMode: ColorTransferMode;
  textureImpasto: number; // 0 to 100
  edgeEnhancement: number; // 0 to 100
  contrast: number; // 0.5 to 1.5
  vibrance: number; // 0.5 to 1.8
  smoothness: number; // 0 to 10
  iterations: number; // 1 to 100
}

export interface StyleAnalysisResult {
  artisticMovement: string;
  dominantPalette: string[];
  paletteNames: string[];
  brushstrokeCharacteristics: string;
  textureGramMatrixSummary: string;
  recommendedSettings: {
    styleWeight: string;
    strokeScale: string;
    colorPreservation: string;
    explanation: string;
  };
  artHistoricalContext: string;
}

export type ViewMode = 'split' | 'side-by-side' | 'single' | 'heatmap';
