'use client';

import React from 'react';
import { Severity } from '@/types/incident';
import { getSeverityMeta } from '@/utils/categoryHelpers';
import { AlertOctagon, Send, ShieldAlert, Sparkles } from 'lucide-react';

interface IssueDetailsStepProps {
  title: string;
  setTitle: (val: string) => void;
  severity: Severity;
  setSeverity: (val: Severity) => void;
  description: string;
  setDescription: (val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const IssueDetailsStep: React.FC<IssueDetailsStepProps> = ({
  title,
  setTitle,
  severity,
  setSeverity,
  description,
  setDescription,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
  const sevMeta = getSeverityMeta(severity);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    setSeverity(severities[index]);
  };

  const getSliderIndex = () => severities.indexOf(severity);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Issue Classification & Details
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Set the incident severity rating and provide a concise summary for municipal taskforce dispatch.
        </p>
      </div>

      {/* Issue Title Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase text-zinc-400 block">
          Incident Title / Brief Headline <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Deep asphalt crater causing traffic hazard near metro station"
          className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
        />
      </div>

      {/* Urgency Slider */}
      <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-white">
              URGENCY / SEVERITY SLIDER
            </span>
          </div>

          {/* Dynamic Severity Badge */}
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${sevMeta.badgeClass} shadow-md`}
          >
            {sevMeta.label.toUpperCase()} PRIORITY
          </span>
        </div>

        {/* Range Input Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={getSliderIndex()}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Step Labels */}
          <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-1">
            <span className={severity === 'low' ? 'text-zinc-300 font-bold' : ''}>
              Low (24h SLA)
            </span>
            <span className={severity === 'medium' ? 'text-cyan-300 font-bold' : ''}>
              Medium (12h SLA)
            </span>
            <span className={severity === 'high' ? 'text-amber-300 font-bold' : ''}>
              High (6h SLA)
            </span>
            <span className={severity === 'critical' ? 'text-rose-400 font-bold' : ''}>
              Critical (4h SLA)
            </span>
          </div>
        </div>
      </div>

      {/* Description Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <label className="uppercase text-zinc-400">
            Operational Description <span className="text-rose-400">*</span>
          </label>
          <span
            className={`text-[11px] ${
              description.length > 250 ? 'text-amber-400' : 'text-zinc-500'
            }`}
          >
            {description.length} / 500 characters
          </span>
        </div>

        <textarea
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the civic issue with details on road blockage, hazards, water accumulation, or affected residents..."
          className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all leading-relaxed"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono font-medium text-zinc-300 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Transmitting Dispatch...' : 'Submit Issue Report'}</span>
        </button>
      </div>
    </div>
  );
};
