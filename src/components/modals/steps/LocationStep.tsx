'use client';

import React, { useState, useRef } from 'react';
import { MapPin, Navigation, UploadCloud, X, Image as ImageIcon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationStepProps {
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  streetName: string;
  setStreetName: (val: string) => void;
  coordinates: string;
  setCoordinates: (val: string) => void;
  photoUrl: string;
  setPhotoUrl: (val: string) => void;
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
  onBack,
  onNext,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeSource, setGeocodeSource] = useState<string>('Auto-Locked');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePhotos = [
    { label: 'Pothole Crater', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Waste Heap', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Streetlight Dark', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Park Damage', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleAutoGeolocate = async () => {
    setIsGeocoding(true);
    try {
      // Simulate/request coordinates and call RapidAPI reverse geocoding
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
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
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Geo-Location & Photo Evidence
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Precision GPS telemetry and camera uploads enable the closest rapid crew unit to locate the issue immediately.
        </p>
      </div>

      {/* GPS Telemetry Box */}
      <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-4 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-bold text-white">
              SATELLITE GPS LOCK
            </span>
          </div>

          <button
            type="button"
            onClick={handleAutoGeolocate}
            disabled={isGeocoding}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 transition-all cursor-pointer"
          >
            {isGeocoding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-cyan-400" />
            )}
            <span>{isGeocoding ? 'Resolving Address...' : geocodeSource}</span>
          </button>
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
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-zinc-400 block mb-1">
              Neighborhood / Ward
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50"
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
                placeholder="e.g. Hill Road, Junction near Mehboob Studio"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Dropzone */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-zinc-400 block">
          Visual Evidence (Photo Upload)
        </label>

        {photoUrl ? (
          <div className="relative rounded-2xl border border-cyan-500/30 overflow-hidden bg-black/60 group">
            <img
              src={photoUrl}
              alt="Incident preview"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
              </span>
              <button
                onClick={() => setPhotoUrl('')}
                className="p-1.5 rounded-lg bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
            <p className="text-[10px] text-zinc-500 mt-0.5">
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
