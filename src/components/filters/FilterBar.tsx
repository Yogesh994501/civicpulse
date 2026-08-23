'use client';

import React from 'react';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { Category, IncidentStatus } from '@/types/incident';
import { SearchInput } from './SearchInput';
import { 
  Layers, 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Trees, 
  CheckCircle2, 
  Clock, 
  Truck, 
  SlidersHorizontal 
} from 'lucide-react';

export const FilterBar: React.FC = () => {
  const {
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    incidents,
    filteredIncidents,
  } = useCivicPulse();

  const categories: { id: 'All' | Category; label: string; icon: any; colorClass: string; activeClass: string }[] = [
    {
      id: 'All',
      label: 'All Issues',
      icon: Layers,
      colorClass: 'text-zinc-400',
      activeClass: 'bg-white/10 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]',
    },
    {
      id: 'Road Repairs',
      label: 'Road Repairs',
      icon: AlertTriangle,
      colorClass: 'text-amber-400',
      activeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
    {
      id: 'Waste Management',
      label: 'Waste Management',
      icon: Trash2,
      colorClass: 'text-emerald-400',
      activeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    },
    {
      id: 'Streetlighting',
      label: 'Streetlighting',
      icon: Lightbulb,
      colorClass: 'text-cyan-400',
      activeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    },
    {
      id: 'Park Maintenance',
      label: 'Park Maintenance',
      icon: Trees,
      colorClass: 'text-rose-400',
      activeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    },
  ];

  const statuses: { id: 'All' | IncidentStatus; label: string; icon: any }[] = [
    { id: 'All', label: 'All', icon: SlidersHorizontal },
    { id: 'Pending', label: 'Pending', icon: Truck },
    { id: 'In Progress', label: 'In Progress', icon: Clock },
    { id: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Top Controls Row: Search & Status Pills & Counter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-zinc-950/80 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        {/* Instant Search Bar */}
        <SearchInput />

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {statuses.map((s) => {
            const Icon = s.icon;
            const isSelected = statusFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:text-zinc-200 hover:border-white/15'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-400 shrink-0 self-start lg:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-200 font-bold">
            {filteredIncidents.length}
          </span>
          <span className="text-zinc-500">OF</span>
          <span className="text-zinc-300">{incidents.length}</span>
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">
            ACTIVE INCIDENTS
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = categoryFilter === cat.id;
          const count = cat.id === 'All'
            ? incidents.length
            : incidents.filter((i) => i.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? cat.activeClass
                  : 'bg-zinc-950/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${cat.colorClass}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
