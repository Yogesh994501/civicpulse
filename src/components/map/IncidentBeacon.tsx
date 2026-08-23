'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Incident } from '@/types/incident';
import { getCategoryMeta, getSeverityMeta } from '@/utils/categoryHelpers';

interface IncidentBeaconProps {
  incident: Incident;
  isSelected: boolean;
  onSelect: (incident: Incident) => void;
}

export const IncidentBeacon: React.FC<IncidentBeaconProps> = ({
  incident,
  isSelected,
  onSelect,
}) => {
  const catMeta = getCategoryMeta(incident.category);
  const sevMeta = getSeverityMeta(incident.severity);

  // Determine pulse animation frequency and ring count based on severity
  const isCritical = incident.severity === 'critical';
  const isHigh = incident.severity === 'high';
  const isMedium = incident.severity === 'medium';

  const pulseDuration = isCritical ? 1.2 : isHigh ? 1.8 : isMedium ? 2.4 : 3.2;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
      style={{
        left: `${incident.mapPosition.x}%`,
        top: `${incident.mapPosition.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(incident);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Incident ${incident.id}: ${incident.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(incident);
        }
      }}
    >
      {/* Expanding Ripple Rings for Critical & High */}
      {isCritical && (
        <>
          <motion.div
            animate={{
              scale: [1, 2.8, 3.4],
              opacity: [0.8, 0.3, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute -inset-2 rounded-full border border-rose-500/80 bg-rose-500/10 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 2.2, 2.8],
              opacity: [0.9, 0.4, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.4,
            }}
            className="absolute -inset-2 rounded-full border border-rose-400/60 pointer-events-none"
          />
        </>
      )}

      {isHigh && (
        <motion.div
          animate={{
            scale: [1, 2.2, 2.6],
            opacity: [0.7, 0.2, 0],
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute -inset-2 rounded-full border border-amber-500/70 bg-amber-500/10 pointer-events-none"
        />
      )}

      {/* Main Beacon Node */}
      <motion.div
        whileHover={{ scale: 1.35 }}
        animate={{
          scale: isSelected ? 1.3 : 1,
        }}
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
          isSelected
            ? 'w-8 h-8 ring-4 ring-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.8)]'
            : 'w-6 h-6 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]'
        }`}
        style={{
          backgroundColor: catMeta.color,
          boxShadow: isSelected
            ? `0 0 35px ${catMeta.color}`
            : `0 0 16px ${catMeta.color}88`,
        }}
      >
        {/* Inner Core */}
        <div className="w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: isCritical ? '#FFFFFF' : catMeta.color }}
          />
        </div>

        {/* Small Beacon Badge on Hover */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          <span style={{ color: catMeta.color }}>● </span>
          {incident.id}
        </div>
      </motion.div>
    </div>
  );
};
