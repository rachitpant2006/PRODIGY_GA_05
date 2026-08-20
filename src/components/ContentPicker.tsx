import React, { useRef, useState } from 'react';
import { SAMPLE_CONTENTS } from '../data/presets';
import { ContentSample } from '../types';
import { ImageIcon, Upload, Camera, Check, X } from 'lucide-react';

interface ContentPickerProps {
  selectedContent: ContentSample;
  onSelectContent: (sample: ContentSample) => void;
  onCustomContentUpload: (imageSrc: string, title: string) => void;
}

export const ContentPicker: React.FC<ContentPickerProps> = ({
  selectedContent,
  onSelectContent,
  onCustomContentUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (src) {
          onCustomContentUpload(src, file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCustomContentUpload(dataUrl, 'Webcam Snapshot');
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  return (
    <div className="bg-slate-900/70 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100">Step 1: Choose Content Photo</h2>
            <p className="text-xs text-slate-400">Select a base image whose composition will be preserved</p>
          </div>
        </div>
      </div>

      {/* Preset Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3.5">
        {SAMPLE_CONTENTS.map((sample) => {
          const isSelected = selectedContent.id === sample.id;
          return (
            <button
              key={sample.id}
              id={`content-sample-${sample.id}`}
              onClick={() => onSelectContent(sample)}
              className={`group relative rounded-xl overflow-hidden text-left border transition-all flex flex-col ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/60'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={sample.thumbnailUrl}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-950/80 text-slate-300 backdrop-blur-sm border border-white/10">
                  {sample.category}
                </span>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-xs text-slate-200 line-clamp-1 group-hover:text-white">
                  {sample.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Upload Drag & Drop or Camera Snap */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/20'
            : 'border-dashed border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
            <img
              src={selectedContent.thumbnailUrl}
              alt="Active content"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200 truncate">
              Selected: {selectedContent.title}
            </p>
            <p className="text-[11px] text-slate-400">
              Drag & drop your own photo or upload from device
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            accept="image/*"
            className="hidden"
          />

          <button
            id="btn-upload-content-photo"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Photo</span>
          </button>

          <button
            id="btn-camera-snap"
            onClick={startCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Webcam</span>
          </button>
        </div>
      </div>

      {/* Webcam Modal Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" /> Capture Photo from Webcam
              </h3>
              <button
                onClick={stopCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 border border-slate-800">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={stopCamera}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Camera className="w-3.5 h-3.5" /> Take Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
