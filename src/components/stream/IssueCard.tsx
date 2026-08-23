'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Incident } from '@/types/incident';
import { 
  getCategoryMeta, 
  getSeverityMeta, 
  getStatusMeta 
} from '@/utils/categoryHelpers';
import { StatusBadge } from './StatusBadge';
import { SLAProgress } from './SLAProgress';
import { 
  MapPin, 
  ThumbsUp, 
  ArrowRight, 
  Users2, 
  Clock, 
  Radio, 
  ExternalLink 
} from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';

interface IssueCardProps {
  incident: Incident;
  isFeatured?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ incident, isFeatured = false }) => {
  const { upvoteIncident, setTimelineModalIncident, setSelectedIncident } = useCivicPulse();

  const catMeta = getCategoryMeta(incident.category);
  const sevMeta = getSeverityMeta(incident.severity);
  const CategoryIcon = catMeta.icon;

  // Calculate relative time string based on reportedAt
  const getRelativeTimeDisplay = () => {
    const diffMs = Date.now() - new Date(incident.reportedAt).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Reported just now';
    if (diffMins < 60) return `Reported ${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    return `Reported ${diffHrs}h ${diffMins % 60}m ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className={`group relative flex flex-col justify-between rounded-2xl bg-zinc-950/80 backdrop-blur-xl border p-5 sm:p-6 transition-all duration-300 ${
        catMeta.borderColor
      } ${
        isFeatured
          ? 'md:col-span-2 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
          : 'hover:border-white/20 hover:bg-zinc-900/80'
      }`}
    >
      {/* Top Ambient Glow on hover */}
      <div
        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${catMeta.color}, transparent)`,
        }}
      />

      <div>
        {/* Card Header: Category Badge + ID + Severity + Status */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-white/5">
          {/* Left: Category Badge & ID */}
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${catMeta.color}15`,
                borderColor: `${catMeta.color}35`,
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

          {/* Right: Status Badge */}
          <StatusBadge status={incident.status} />
        </div>

        {/* Card Body: Title, Location, and Description */}
        <div className="mt-4 space-y-2">
          <h3 className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors leading-snug">
            {incident.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {incident.description}
          </p>

          {/* Location & Relative Time */}
          <div className="pt-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-medium truncate">{incident.streetName}, {incident.neighborhood}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pl-5">
              <span>{incident.coordinates}</span>
              <span className="text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                {getRelativeTimeDisplay()}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Crew Pill */}
        <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <Users2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-zinc-400 text-[11px] truncate">
              Unit: <span className="text-zinc-200 font-semibold">{incident.assignedCrew.unitId}</span> ({incident.assignedCrew.crewName})
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10 shrink-0">
            {incident.assignedCrew.status.toUpperCase()}
          </span>
        </div>

        {/* SLA Progress Bar */}
        <div className="mt-4">
          <SLAProgress
            category={incident.category}
            totalSeconds={incident.slaTotalSeconds}
            remainingSeconds={incident.slaRemainingSeconds}
            isResolved={incident.status === 'resolved'}
          />
        </div>
      </div>

      {/* Card Footer: Upvote Engagement & Timeline Action */}
      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3">
        {/* Upvote Button */}
        <button
          onClick={() => upvoteIncident(incident.id)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
            incident.hasUserUpvoted
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:border-white/25 hover:bg-zinc-800'
          }`}
          aria-label={`Upvote incident ${incident.id}`}
        >
          <ThumbsUp
            className={`w-3.5 h-3.5 transition-transform ${
              incident.hasUserUpvoted ? 'fill-cyan-400 text-cyan-400 scale-110' : 'group-hover:scale-105'
            }`}
          />
          <span className="font-semibold">{incident.upvotes}</span>
          <span className="hidden sm:inline text-zinc-400">Upvotes</span>
        </button>

        {/* Action: View Resolution Timeline */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedIncident(incident)}
            title="Focus on Tactical Radar"
            className="p-1.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setTimelineModalIncident(incident)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-medium transition-all group/btn shadow-sm"
          >
            <span>View Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
