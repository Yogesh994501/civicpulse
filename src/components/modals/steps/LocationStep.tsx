'use client';

import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  UploadCloud, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Bot, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Severity } from '@/types/incident';
import { NormalizedImageAnalysis } from '@/services/normalizers';

interface LocationStepProps {
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  streetName: string;
  setStreetName: (val: string) => void;
  coordinates: string;
  setCoordinates: (val: string) => void;
  photoUrl: string;
  setPhotoUrl: (val: string) => void;
  category?: Category;
  setCategory?: (val: Category) => void;
  setTitle?: (val: string) => void;
  setSeverity?: (val: Severity) => void;
  onBack: () => void;
  onNext: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  neighborhood,
  setNeighborhood,
  streetName,
  setStreetName,
  coordinates,
  setCoordinates,
  photoUrl,
  setPhotoUrl,
  category,
  setCategory,
  setTitle,
  setSeverity,
  onBack,
  onNext,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [geocodeSource, setGeocodeSource] = useState<string>('Auto-Locked');
  const [visionSuggestion, setVisionSuggestion] = useState<NormalizedImageAnalysis | null>(null);
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePhotos = [
    { label: 'Pothole Crater', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', hint: 'pothole road damage' },
    { label: 'Waste Heap', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80', hint: 'waste trash overflow' },
    { label: 'Streetlight Dark', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', hint: 'streetlight dark lamp outage' },
    { label: 'Park Damage', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80', hint: 'park bench damage hazard' },
  ];

  const handleAutoGeolocate = async () => {
    setIsGeocoding(true);
    try {
      // Simulate/fetch coordinates and call RapidAPI reverse geocoding
      const lat = (19.055 + Math.random() * 0.025).toFixed(4);
      const lon = (72.825 + Math.random() * 0.020).toFixed(4);

      const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCoordinates(`${lat}° N, ${lon}° E`);
          setNeighborhood(json.data.neighborhood);
          setStreetName(json.data.streetName);
          setGeocodeSource(json.data.source === 'rapidapi' ? 'RapidAPI Geocode Lock' : 'Satellite Radar Lock');
        }
      }
    } catch (e) {
      console.warn('Geocoding error:', e);
    } finally {
      setIsGeocoding(false);
    }
  };

  const analyzePhoto = async (url: string, hint = '') => {
    setIsAnalyzingImage(true);
    setAppliedSuggestion(false);
    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: url, fileName: hint }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setVisionSuggestion(json.data);
        }
      }
    } catch (e) {
      console.warn('Image analysis failed:', e);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleApplyVisionSuggestion = () => {
    if (!visionSuggestion) return;
    if (setCategory) setCategory(visionSuggestion.suggestedCategory);
    if (setSeverity) setSeverity(visionSuggestion.suggestedSeverity);
    if (setTitle) setTitle(visionSuggestion.suggestedTitle);
    setAppliedSuggestion(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoUrl(dataUrl);
        analyzePhoto(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoUrl(dataUrl);
        analyzePhoto(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white font-mono">
          Geo-Location & Evidence Upload
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Precision GPS telemetry and camera uploads enable rapid crew units to locate the issue immediately.
        </p>
      </div>

      {/* GPS Telemetry Box */}
      <div className="rounded-2xl bg-zinc-950/90 border border-cyan-500/20 p-4 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              SATELLITE GPS LOCK
            </span>
          </div>

          <button
            type="button"
            onClick={handleAutoGeolocate}
            disabled={isGeocoding}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 transition-all cursor-pointer shadow-md"
          >
            {isGeocoding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-cyan-400" />
            )}
            <span>{isGeocoding ? 'LOCATING...' : 'AUTO-DETECT GPS'}</span>
          </button>
        </div>

        {/* Location Detected Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 font-mono text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>LOCATION DETECTED: <strong className="text-white">{neighborhood}, Mumbai</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          <div>
            <label className="text-[10px] uppercase text-zinc-400 block mb-1">
              GPS Coordinates
            </label>
            <input
              type="text"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-zinc-400 block mb-1">
              Neighborhood / Ward
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="Bandra West">Bandra West (H-West Ward)</option>
              <option value="Khar Danda">Khar Danda / Khar West</option>
              <option value="Santacruz West">Santacruz West</option>
              <option value="Pali Hill">Pali Hill Residential Enclave</option>
              <option value="Kurla West">Kurla West (L-Ward)</option>
              <option value="Bandra Reclamation">Bandra Reclamation Sector 5</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase text-zinc-400 block mb-1">
              Exact Landmark / Street Name
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="e.g. Linking Road, Junction near National College"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Dropzone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-zinc-400 block">
            Visual Evidence (Photo Upload)
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            OPTIONAL RAPIDAPI AI VISION SCAN
          </span>
        </div>

        {photoUrl ? (
          <div className="space-y-3">
            <div className="relative rounded-2xl border border-cyan-500/30 overflow-hidden bg-black/80 group shadow-lg">
              <img
                src={photoUrl}
                alt="Incident preview"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                </span>
                <button
                  onClick={() => {
                    setPhotoUrl('');
                    setVisionSuggestion(null);
                  }}
                  className="p-1.5 rounded-lg bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Vision Analysis Suggestion Box */}
            <AnimatePresence>
              {isAnalyzingImage && (
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-500/30 flex items-center gap-2 text-xs font-mono text-cyan-300 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>ANALYZING IMAGE FEATURES WITH VISION CORE...</span>
                </div>
              )}

              {visionSuggestion && !isAnalyzingImage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-zinc-950 border border-cyan-500/40 font-mono text-xs space-y-2 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span>AI VISION SUGGESTION</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                      {visionSuggestion.confidenceScore}% CONFIDENCE
                    </span>
                  </div>

                  <p className="text-zinc-300 text-xs">
                    Possible Issue: <strong className="text-white">{visionSuggestion.suggestedCategory.toUpperCase()}</strong> ({visionSuggestion.suggestedSeverity} Severity)
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] text-zinc-500">
                      Labels: {visionSuggestion.detectedLabels.join(', ') || 'infrastructure_anomaly'}
                    </span>

                    <button
                      type="button"
                      onClick={handleApplyVisionSuggestion}
                      disabled={appliedSuggestion}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        appliedSuggestion
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      }`}
                    >
                      {appliedSuggestion ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Apply Suggestion</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/15 bg-zinc-950/60 hover:border-white/30 hover:bg-zinc-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-white font-mono">
              Drop incident photo here, or browse files
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">
              Supports PNG, JPG, WEBP up to 10MB
            </p>

            {/* Quick Demo Presets */}
            <div className="mt-4 pt-3 border-t border-white/5 w-full">
              <span className="text-[10px] font-mono text-zinc-500 block mb-2">
                OR SELECT INCIDENT SAMPLE:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {samplePhotos.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoUrl(sample.url);
                      analyzePhoto(sample.url, sample.hint);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[10px] font-mono text-zinc-300 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono font-medium text-zinc-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-mono"
        >
          Continue to Details →
        </button>
      </div>
    </div>
  );
};
