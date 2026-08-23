'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident } from '@/types/incident';
import { 
  getCategoryMeta, 
  getSeverityMeta, 
  getStatusMeta, 
  formatSecondsToCountdown 
} from '@/utils/categoryHelpers';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Users2, 
  ArrowUpRight, 
  ThumbsUp, 
  Radio, 
  CheckCircle 
} from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';

interface BeaconTooltipProps {
  incident: Incident | null;
  onClose: () => void;
  onOpenTimeline: (incident: Incident) => void;
}

export const BeaconTooltip: React.FC<BeaconTooltipProps> = ({
  incident,
  onClose,
  onOpenTimeline,
}) => {
  const { upvoteIncident } = useCivicPulse();

  if (!incident) return null;

  const catMeta = getCategoryMeta(incident.category);
  const sevMeta = getSeverityMeta(incident.severity);
  const statusMeta = getStatusMeta(incident.status);
  const StatusIcon = statusMeta.icon;
  const CategoryIcon = catMeta.icon;

  // Compute position relative to coordinates so it doesn't overflow
  const isRightSide = incident.mapPosition.x > 60;
  const isBottomSide = incident.mapPosition.y > 65;

  return (
    <AnimatePresence>
      <motion.div
        key={incident.id}
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`absolute z-30 w-80 sm:w-96 rounded-2xl glass-modal border p-4 sm:p-5 shadow-2xl backdrop-blur-2xl ${catMeta.borderColor}`}
        style={{
          left: isRightSide ? `${Math.max(10, incident.mapPosition.x - 38)}%` : `${incident.mapPosition.x + 3}%`,
          top: isBottomSide ? `${Math.max(10, incident.mapPosition.y - 32)}%` : `${incident.mapPosition.y + 3}%`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: `${catMeta.color}18`,
                borderColor: `${catMeta.color}40`,
                color: catMeta.color,
              }}
            >
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {incident.id}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sevMeta.badgeClass}`}
                >
                  {sevMeta.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {catMeta.label}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close tooltip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Street Details */}
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {incident.title}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{incident.streetName}, {incident.neighborhood}</span>
          </div>
          <div className="mt-0.5 text-[11px] font-mono text-zinc-500 pl-5">
            LOC: {incident.coordinates}
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 bg-black/40 rounded-xl p-2.5 border border-white/5 font-mono text-xs">
          {/* Status */}
          <div>
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">STATUS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StatusIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-200 font-semibold text-[11px]">
                {statusMeta.label}
              </span>
            </div>
          </div>

          {/* Assigned Crew */}
          <div>
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">FIELD UNIT</span>
            <div className="flex items-center gap-1.5 mt-0.5 truncate">
              <Users2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-zinc-200 text-[11px] truncate">
                {incident.assignedCrew.unitId} ({incident.assignedCrew.status})
              </span>
            </div>
          </div>

          {/* Live SLA Countdown */}
          <div className="col-span-2 mt-1 pt-1.5 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-[10px] uppercase text-zinc-400">SLA REMAINING:</span>
            </div>
            <span
              className={`font-mono text-xs font-bold ${
                incident.slaRemainingSeconds < 1800 ? 'text-rose-400' : 'text-cyan-300'
              }`}
            >
              {formatSecondsToCountdown(incident.slaRemainingSeconds)}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
          {/* Upvote Button */}
          <button
            onClick={() => upvoteIncident(incident.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              incident.hasUserUpvoted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-zinc-800'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${incident.hasUserUpvoted ? 'fill-cyan-400 text-cyan-400' : ''}`} />
            <span>{incident.upvotes} Upvotes</span>
          </button>

          {/* Timeline Action */}
          <button
            onClick={() => onOpenTimeline(incident)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-medium transition-all group"
          >
            <span>Timeline</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
