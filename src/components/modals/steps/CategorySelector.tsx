'use client';

import React from 'react';
import { Category } from '@/types/incident';
import { AlertTriangle, Trash2, Lightbulb, Trees, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategorySelectorProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  onNext: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  onNext,
}) => {
  const options: { id: Category; name: string; desc: string; icon: any; color: string; border: string; bg: string; glow: string }[] = [
    {
      id: 'road_repairs',
      name: 'Road Repairs',
      desc: 'Potholes, road subsidence, waterlogging, broken curbs',
      icon: AlertTriangle,
      color: '#F59E0B',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    },
    {
      id: 'waste_management',
      name: 'Waste Management',
      desc: 'Overflowing dumpsters, debris dumping, drain blockage',
      icon: Trash2,
      color: '#10B981',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    },
    {
      id: 'streetlighting',
      name: 'Streetlighting',
      desc: 'Blown luminaires, dark corridors, short-circuit hazards',
      icon: Lightbulb,
      color: '#06B6D4',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-500/10',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    },
    {
      id: 'park_maintenance',
      name: 'Park Maintenance',
      desc: 'Damaged play gear, fallen tree limbs, fence fractures',
      icon: Trees,
      color: '#F43F5E',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Select Incident Category
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Choose the municipal domain that matches the nature of the issue for automated AI dispatch routing.
        </p>
      </div>

      {/* 2x2 Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedCategory === opt.id;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(opt.id)}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? `${opt.bg} ${opt.border} ${opt.glow} ring-2 ring-white/20`
                  : 'bg-zinc-950/60 border-white/10 hover:border-white/25 hover:bg-zinc-900/60'
              }`}
            >
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-black"
                  style={{ backgroundColor: opt.color }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${opt.color}15`,
                  borderColor: `${opt.color}40`,
                  color: opt.color,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white font-mono">
                  {opt.name}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-mono"
        >
          Continue to Location →
        </button>
      </div>
    </div>
  );
};
