'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShieldAlert } from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';

export const ReportIssueFAB: React.FC = () => {
  const { setIsReportDrawerOpen } = useCivicPulse();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setIsReportDrawerOpen(true)}
      aria-label="Report a civic issue"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-sm shadow-[0_10px_35px_rgba(6,182,212,0.45)] border border-cyan-300/40 cursor-pointer group transition-all"
    >
      <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center">
        <Plus className="w-4 h-4 text-black stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
      </div>
      <span>Report Issue</span>
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
      </span>
    </motion.button>
  );
};
