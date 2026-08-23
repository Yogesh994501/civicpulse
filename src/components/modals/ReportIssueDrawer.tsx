'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { Category, Severity } from '@/types/incident';
import { CategorySelector } from './steps/CategorySelector';
import { LocationStep } from './steps/LocationStep';
import { IssueDetailsStep } from './steps/IssueDetailsStep';
import { X, Check } from 'lucide-react';

export const ReportIssueDrawer: React.FC = () => {
  const { isReportDrawerOpen, setIsReportDrawerOpen, addNewIncident } = useCivicPulse();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<Category>('Road Repairs');
  const [neighborhood, setNeighborhood] = useState<string>('Bandra West');
  const [streetName, setStreetName] = useState<string>('Hill Road, Near Mehboob Studio');
  const [coordinates, setCoordinates] = useState<string>('19.0559° N, 72.8280° E');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('High');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsReportDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsReportDrawerOpen]);

  const resetForm = () => {
    setStep(1);
    setCategory('Road Repairs');
    setNeighborhood('Bandra West');
    setStreetName('Hill Road, Near Mehboob Studio');
    setCoordinates('19.0559° N, 72.8280° E');
    setPhotoUrl('');
    setTitle('');
    setSeverity('High');
    setDescription('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsReportDrawerOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const success = addNewIncident({
        title,
        category,
        severity,
        neighborhood,
        streetName,
        coordinates,
        description,
        photoUrl: photoUrl || undefined,
      });

      if (success) {
        setIsSubmitting(false);
        handleClose();
      } else {
        setIsSubmitting(false);
      }
    }, 600);
  };

  if (!isReportDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-modal border border-white/15 bg-zinc-950/95 overflow-hidden shadow-2xl z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-zinc-950/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  CITIZEN TELEMETRY INGESTION
                </span>
                <span className="text-zinc-500 text-xs font-mono">· STEP {step} OF 3</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Report Neighborhood Civic Issue
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close report issue modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Step Progress Indicator */}
          <div className="px-5 sm:px-6 py-3 bg-black/50 border-b border-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 sm:gap-4 w-full">
              {/* Step 1 */}
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    step >= 1 ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </div>
                <span className={`text-xs truncate ${step === 1 ? 'text-cyan-300 font-bold' : 'text-zinc-400'}`}>
                  01 Category
                </span>
              </div>

              <span className="text-zinc-700">→</span>

              {/* Step 2 */}
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    step >= 2 ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {step > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                </div>
                <span className={`text-xs truncate ${step === 2 ? 'text-cyan-300 font-bold' : 'text-zinc-400'}`}>
                  02 Location
                </span>
              </div>

              <span className="text-zinc-700">→</span>

              {/* Step 3 */}
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    step === 3 ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  3
                </div>
                <span className={`text-xs truncate ${step === 3 ? 'text-cyan-300 font-bold' : 'text-zinc-400'}`}>
                  03 Details
                </span>
              </div>
            </div>
          </div>

          {/* Form Body with Smooth Transition */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {step === 1 && (
              <CategorySelector
                selectedCategory={category}
                onSelectCategory={setCategory}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <LocationStep
                neighborhood={neighborhood}
                setNeighborhood={setNeighborhood}
                streetName={streetName}
                setStreetName={setStreetName}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                photoUrl={photoUrl}
                setPhotoUrl={setPhotoUrl}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <IssueDetailsStep
                title={title}
                setTitle={setTitle}
                severity={severity}
                setSeverity={setSeverity}
                description={description}
                setDescription={setDescription}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
