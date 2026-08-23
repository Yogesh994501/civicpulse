'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { CheckCircle2, AlertTriangle, Info, X, Radio } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useCivicPulse();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 5500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-6 z-50 max-w-md rounded-2xl glass-modal border border-emerald-500/40 bg-zinc-950/95 p-4 shadow-2xl flex items-start gap-3.5"
      >
        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald-400 font-bold tracking-wider">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>DISPATCH CONFIRMED</span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono mt-0.5">
            {toast.title}
          </h4>
          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        </div>

        <button
          onClick={clearToast}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
