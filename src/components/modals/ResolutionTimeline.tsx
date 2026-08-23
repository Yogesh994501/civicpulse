'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident } from '@/types/incident';
import { 
  getCategoryMeta, 
  getSeverityMeta, 
  getStatusMeta, 
  formatSecondsToCountdown, 
  getRelativeTimeString 
} from '@/utils/categoryHelpers';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Users2, 
  Radio, 
  Navigation, 
  Image as ImageIcon, 
  Sparkles, 
  Truck, 
  Wrench, 
  CheckCheck, 
  Activity, 
  FileCheck2 
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

  // Determine stage icons based on step
  const getStageIcon = (stepNumber: number, status: string) => {
    switch (stepNumber) {
      case 1:
        return CheckCircle2;
      case 2:
        return Sparkles;
      case 3:
        return Truck;
      case 4:
      default:
        return status === 'Completed' ? CheckCheck : Wrench;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 md:p-6 overflow-hidden">
        {/* Pitch Black Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal / Mobile Drawer Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-zinc-950/90 shrink-0">
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
                {/* Header Subtitles */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    RESOLUTION TIMELINE
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    LIVE INCIDENT TRACKING
                  </span>
                </div>

                {/* Incident ID, Severity, Title */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
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

                <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  {incident.title}
                </h2>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{incident.streetName}, {incident.neighborhood}</span>
                  <span className="text-zinc-600 hidden sm:inline">|</span>
                  <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline">{incident.coordinates}</span>
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
          <div className="px-4 sm:px-6 py-3 bg-black/70 border-b border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-zinc-500 uppercase text-[10px] block">ASSIGNED FIELD CREW</span>
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

          {/* 4-Stage Vertical Timeline */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                STAGE-BY-STAGE MUNICIPAL EXECUTION
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                {incident.timeline.filter((e) => e.status === 'Completed').length} / 4 Stages Completed
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6">
              {/* Dynamic Vertical Category Connector Line */}
              <div
                className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${catMeta.color}, ${catMeta.color}88, rgba(255,255,255,0.08))`,
                }}
              />

              {incident.timeline.map((event, index) => {
                const isDone = event.status === 'Completed';
                const isCurrent = event.status === 'In Progress';
                const isPending = event.status === 'Pending';
                const StageIcon = getStageIcon(event.stepNumber, event.status);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Status Node Icon */}
                    <div
                      className={`absolute -left-[23px] sm:-left-[27px] mt-0.5 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isDone
                          ? 'w-6 h-6 text-black font-bold shadow-md'
                          : isCurrent
                          ? 'w-6 h-6 text-black ring-4 ring-cyan-500/30 animate-pulse'
                          : 'w-5 h-5 bg-zinc-900 border border-white/20 text-zinc-600'
                      }`}
                      style={{
                        backgroundColor: isDone ? catMeta.color : isCurrent ? '#06B6D4' : undefined,
                        boxShadow: isDone ? `0 0 14px ${catMeta.color}88` : undefined,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isCurrent ? (
                        <Clock className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-zinc-500">{event.stepNumber}</span>
                      )}
                    </div>

                    {/* Timeline Stage Card */}
                    <div
                      className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all ${
                        isCurrent
                          ? 'bg-zinc-950/80 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                          : isDone
                          ? 'bg-zinc-950/70 border-white/10'
                          : 'bg-zinc-950/40 border-white/5 opacity-55'
                      }`}
                    >
                      {/* Top Row: Stage Name & Timestamp */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <StageIcon
                            className="w-4 h-4"
                            style={{ color: isDone ? catMeta.color : isCurrent ? '#06B6D4' : '#71717A' }}
                          />
                          <span className="font-bold text-white text-sm">
                            0{event.stepNumber} — {event.stage}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {/* Stage 02 Custom: AI VERIFIED Badge */}
                          {event.stepNumber === 2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                              <Sparkles className="w-3 h-3" />
                              AI VERIFIED
                            </span>
                          )}

                          {/* Status Pill */}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                              isDone
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : isCurrent
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                                : 'bg-zinc-800 text-zinc-400 border-white/5'
                            }`}
                          >
                            {event.status}
                          </span>

                          <span className="text-zinc-500 text-[11px]">{event.timestamp}</span>
                        </div>
                      </div>

                      {/* Stage Specific Content */}
                      <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Stage 01 Extra: Incident ID & Neighborhood Callout */}
                      {event.stepNumber === 1 && (
                        <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded-xl border border-white/5">
                          <span>ID: <strong className="text-white">{incident.id}</strong></span>
                          <span className="text-zinc-600">·</span>
                          <span>AREA: <strong className="text-white">{incident.neighborhood}</strong></span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-emerald-400 font-semibold">✓ Citizen Verified</span>
                        </div>
                      )}

                      {/* Stage 02 Extra: Category & Severity Classification */}
                      {event.stepNumber === 2 && (
                        <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded-xl border border-white/5">
                          <span>DETECTED: <strong className="text-white">{incident.category}</strong></span>
                          <span className="text-zinc-600">·</span>
                          <span>SEVERITY: <strong className="text-rose-400">{incident.severity}</strong></span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-cyan-300">Confidence 98.6%</span>
                        </div>
                      )}

                      {/* Stage 03 Extra: Live Animated GPS-Style Crew Badge */}
                      {event.crewGpsBadge && (
                        <div className="mt-3 p-3 rounded-xl bg-black/70 border border-cyan-500/30 font-mono text-xs space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                              </span>
                              <span className="text-cyan-300 font-bold text-xs">
                                {event.crewGpsBadge.status}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-bold">
                              LIVE GPS BEACON
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                            <div>
                              <span className="text-zinc-500 text-[10px] block">CREW NAME</span>
                              <span className="text-zinc-200 font-medium">{event.crewGpsBadge.crewName}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 text-[10px] block">LEAD OFFICER</span>
                              <span className="text-zinc-200 font-medium">{event.crewGpsBadge.leadName}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                              <span>COORDS: {event.crewGpsBadge.coordinates}</span>
                              {event.crewGpsBadge.speedKmh !== undefined && (
                                <span className="text-emerald-400 font-semibold">TELEMETRY SPEED: {event.crewGpsBadge.speedKmh} km/h</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage 04 Extra: Before / After Photo Verification Area */}
                      {event.stepNumber === 4 && (
                        <div className="mt-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5 font-bold">
                              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                              FIELD PHOTO EVIDENCE (BEFORE & AFTER)
                            </span>

                            {(isDone || isCurrent) && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                                <FileCheck2 className="w-3 h-3" />
                                ✓ FIELD VERIFIED
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            {/* Before Snapshot */}
                            <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black group h-28 sm:h-32">
                              {event.photoVerification?.beforeUrl || incident.photoUrl ? (
                                <img
                                  src={event.photoVerification?.beforeUrl || incident.photoUrl}
                                  alt="Before remediation"
                                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 font-mono text-[10px]">
                                  <ImageIcon className="w-5 h-5 mb-1 text-zinc-700" />
                                  <span>NO PHOTO LOGGED</span>
                                </div>
                              )}
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-rose-500/40 text-[9px] font-mono font-bold text-rose-300 shadow">
                                BEFORE
                              </div>
                            </div>

                            {/* After Snapshot */}
                            <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black group h-28 sm:h-32">
                              {event.photoVerification?.afterUrl ? (
                                <img
                                  src={event.photoVerification.afterUrl}
                                  alt="After restoration"
                                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-[10px] bg-zinc-950 p-2 text-center">
                                  <Clock className="w-5 h-5 mb-1 text-cyan-400 animate-pulse" />
                                  <span>RESTORATION PHOTO IN PROGRESS</span>
                                </div>
                              )}
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-300 shadow">
                                AFTER
                              </div>
                            </div>
                          </div>

                          {event.photoVerification?.verifiedNote && (
                            <p className="text-[11px] text-zinc-400 font-mono italic pt-1">
                              Note: {event.photoVerification.verifiedNote}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Footer Org Badge */}
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Org: {event.assignedTeam}
                        </span>
                        <span className="text-zinc-500">
                          {event.relativeTime}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="p-4 sm:p-5 bg-zinc-950 border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-zinc-500 truncate">
              AUDIT TRAIL: {incident.id}-IMMUTABLE
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
