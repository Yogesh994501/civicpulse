'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident, TimelineStep } from '@/types/incident';
import { 
  getCategoryMeta, 
  getSeverityMeta, 
  getStatusMeta, 
  formatSecondsToCountdown 
} from '@/utils/categoryHelpers';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  ShieldCheck, 
  MapPin, 
  Users2, 
  Radio, 
  Navigation, 
  Image as ImageIcon, 
  Sparkles 
} from 'lucide-react';
import { SLAProgress } from '../stream/SLAProgress';

interface ResolutionTimelineProps {
  incident: Incident | null;
  onClose: () => void;
}

export const ResolutionTimeline: React.FC<ResolutionTimelineProps> = ({
  incident,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!incident) return null;

  const catMeta = getCategoryMeta(incident.category);
  const sevMeta = getSeverityMeta(incident.severity);
  const statusMeta = getStatusMeta(incident.status);
  const CategoryIcon = catMeta.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-white/15 overflow-hidden shadow-2xl z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-zinc-950/80">
            <div className="flex items-start gap-3">
              <div
                className="p-2.5 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${catMeta.color}15`,
                  borderColor: `${catMeta.color}35`,
                  color: catMeta.color,
                }}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {incident.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sevMeta.badgeClass}`}>
                    {sevMeta.label}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    · {catMeta.label}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  {incident.title}
                </h2>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{incident.streetName}, {incident.neighborhood}</span>
                  <span className="text-zinc-600">|</span>
                  <span className="font-mono text-[11px] text-zinc-500">{incident.coordinates}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close resolution timeline modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SLA & Dispatch Summary Bar */}
          <div className="px-5 sm:px-6 py-3 bg-black/60 border-b border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-zinc-500 uppercase text-[10px] block">ASSIGNED FIELD TASKFORCE</span>
                <span className="text-zinc-200 font-semibold truncate">
                  {incident.assignedCrew}
                </span>
              </div>
            </div>

            <div>
              <SLAProgress
                category={incident.category}
                totalSeconds={incident.slaTotal}
                remainingSeconds={incident.slaRemaining}
                isResolved={incident.status === 'Resolved'}
              />
            </div>
          </div>

          {/* Timeline Content List with Framer Motion Stagger */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                MUNICIPAL AUDIT TRAIL · 4-STAGE PROGRESSION
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                {incident.timeline.filter((e) => e.status === 'Completed').length} / 4 Stages Completed
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6">
              {/* Connecting vertical line */}
              <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-cyan-500 via-emerald-500/50 to-zinc-800" />

              {incident.timeline.map((event, index) => {
                const isDone = event.status === 'Completed';
                const isCurrent = event.status === 'In Progress';

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Status Node Icon */}
                    <div
                      className={`absolute -left-[23px] sm:-left-[27px] mt-0.5 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isDone
                          ? 'w-6 h-6 bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : isCurrent
                          ? 'w-6 h-6 bg-cyan-400 text-black ring-4 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse'
                          : 'w-5 h-5 bg-zinc-900 border border-white/20 text-zinc-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isCurrent ? (
                        <Clock className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-zinc-500">{event.stepNumber}</span>
                      )}
                    </div>

                    {/* Timeline Stage Box */}
                    <div
                      className={`flex-1 rounded-2xl p-4 border transition-all ${
                        isCurrent
                          ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                          : isDone
                          ? 'bg-zinc-900/70 border-white/10'
                          : 'bg-zinc-950/40 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-white/5 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {event.stepNumber}. {event.stage}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                              ACTIVE STAGE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                          <span>{event.timestamp}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-500">{event.relativeTime}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Stage 3 Custom: Live GPS-Style Maintenance Crew Badge */}
                      {event.crewGpsBadge && (
                        <div className="mt-3 p-3 rounded-xl bg-black/60 border border-cyan-500/30 font-mono text-xs space-y-1.5 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                              <Navigation className="w-3.5 h-3.5 animate-spin-slow" />
                              LIVE CREW GPS TELEMETRY
                            </span>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20">
                              {event.crewGpsBadge.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                            <div>
                              <span className="text-zinc-500 text-[10px] block">CREW & UNIT</span>
                              <span className="text-zinc-200 font-medium">{event.crewGpsBadge.crewName} ({event.crewGpsBadge.unitId})</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 text-[10px] block">LEAD OFFICER</span>
                              <span className="text-zinc-200 font-medium">{event.crewGpsBadge.leadName}</span>
                            </div>
                            <div className="col-span-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/5 pt-1">
                              <span>COORDS: {event.crewGpsBadge.coordinates}</span>
                              {event.crewGpsBadge.speedKmh !== undefined && (
                                <span className="text-emerald-400 font-semibold">SPEED: {event.crewGpsBadge.speedKmh} km/h</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage 4 Custom: Before & After Photo Verification Cards */}
                      {event.photoVerification && (
                        <div className="mt-3.5 space-y-2">
                          <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                            FIELD VERIFICATION TELEMETRY SNAPSHOTS
                          </span>

                          <div className="grid grid-cols-2 gap-2.5">
                            {/* Before Snapshot */}
                            <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black group">
                              <img
                                src={event.photoVerification.beforeUrl || incident.photoUrl}
                                alt="Before remediation"
                                className="w-full h-24 object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 border border-rose-500/40 text-[9px] font-mono font-bold text-rose-300">
                                BEFORE
                              </div>
                            </div>

                            {/* After Snapshot */}
                            <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black group">
                              <img
                                src={event.photoVerification.afterUrl || incident.photoUrl}
                                alt="After remediation"
                                className="w-full h-24 object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-300">
                                AFTER RESTORATION
                              </div>
                            </div>
                          </div>

                          {event.photoVerification.verifiedNote && (
                            <p className="text-[11px] text-zinc-400 font-mono italic">
                              Note: {event.photoVerification.verifiedNote}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Org: {event.assignedTeam}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="p-4 sm:p-5 bg-zinc-950 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">
              IMMUTABLE AUDIT LOG ID: {incident.id}-REC
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-medium text-white transition-colors"
            >
              Close Timeline
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
