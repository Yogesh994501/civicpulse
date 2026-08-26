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

  const isCritical = incident.severity === 'Critical';
  const isHigh = incident.severity === 'High';
  const isMedium = incident.severity === 'Medium';
  const isLow = incident.severity === 'Low';

  const pulseDuration = isCritical ? 1.1 : isHigh ? 1.6 : isMedium ? 2.2 : 3.0;

  // Beacon center & glow color based on severity/category
  const beaconColor = isCritical 
    ? '#F43F5E' 
    : isHigh 
    ? '#F59E0B' 
    : isMedium 
    ? '#06B6D4' 
    : '#10B981';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
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
      {/* 3 Expanding Ripple Rings for Critical */}
      {isCritical && (
        <>
          <motion.div
            animate={{
              scale: [1, 3.2, 4.0],
              opacity: [0.9, 0.4, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute -inset-2.5 rounded-full border-2 border-rose-500 bg-rose-500/15 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 2.4, 3.2],
              opacity: [0.85, 0.35, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.35,
            }}
            className="absolute -inset-2.5 rounded-full border border-rose-400/80 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 2.4],
              opacity: [0.95, 0.45, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.7,
            }}
            className="absolute -inset-2.5 rounded-full border border-rose-300/90 pointer-events-none"
          />
        </>
      )}

      {/* 2 Expanding Ripple Rings for High */}
      {isHigh && (
        <>
          <motion.div
            animate={{
              scale: [1, 2.6, 3.2],
              opacity: [0.8, 0.3, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute -inset-2 rounded-full border-2 border-amber-500/90 bg-amber-500/15 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 2.4],
              opacity: [0.9, 0.4, 0],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
            className="absolute -inset-2 rounded-full border border-amber-400/80 pointer-events-none"
          />
        </>
      )}

      {/* 1 Expanding Ripple Ring for Medium */}
      {isMedium && (
        <motion.div
          animate={{
            scale: [1, 2.0, 2.5],
            opacity: [0.75, 0.2, 0],
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute -inset-1.5 rounded-full border border-cyan-400/80 bg-cyan-400/10 pointer-events-none"
        />
      )}

      {/* Soft Glow Pulse for Low */}
      {isLow && (
        <motion.div
          animate={{
            scale: [1, 1.6, 2.0],
            opacity: [0.6, 0.15, 0],
          }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute -inset-1.5 rounded-full border border-emerald-400/60 bg-emerald-400/10 pointer-events-none"
        />
      )}

      {/* Main Beacon Node */}
      <motion.div
        whileHover={{ scale: 1.4 }}
        animate={{
          scale: isSelected ? 1.35 : 1,
        }}
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
          isSelected
            ? 'w-8 h-8 ring-4 ring-cyan-300/80 shadow-[0_0_40px_rgba(6,182,212,1)]'
            : 'w-6 h-6 hover:shadow-[0_0_25px_rgba(255,255,255,0.7)]'
        }`}
        style={{
          backgroundColor: beaconColor,
          boxShadow: isSelected
            ? `0 0 45px ${beaconColor}, 0 0 20px #FFFFFF`
            : `0 0 20px ${beaconColor}, 0 0 8px #FFFFFF88`,
        }}
      >
        {/* Inner Core */}
        <div className="w-2.5 h-2.5 rounded-full bg-black/90 flex items-center justify-center">
          <div
            className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#FFFFFF]"
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </div>

        {/* Small Beacon Badge on Hover */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/95 border border-white/30 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-40">
          <span style={{ color: beaconColor }}>● </span>
          <strong>{incident.id}</strong> · {incident.category}
        </div>
      </motion.div>
    </div>
  );
};
