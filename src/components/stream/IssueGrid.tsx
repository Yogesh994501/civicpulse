'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { IssueCard } from './IssueCard';
import { ShieldAlert, RefreshCw, Plus } from 'lucide-react';

export const IssueGrid: React.FC = () => {
  const {
    filteredIncidents,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    setIsReportDrawerOpen,
  } = useCivicPulse();

  const resetFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      {filteredIncidents.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-zinc-950/60 border border-white/10 glass-panel"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-4 shadow-xl">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">
            No Matching Civic Incidents
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6">
            No active emergency or municipal reports found matching your current filter criteria or search string.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
            <button
              onClick={() => setIsReportDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-semibold text-black transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Incident</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Responsive Bento Grid */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredIncidents.map((incident, index) => {
              // Feature the first critical incident if present
              const isFirstFeatured = index === 0 && incident.severity === 'critical';
              return (
                <IssueCard
                  key={incident.id}
                  incident={incident}
                  isFeatured={isFirstFeatured}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
