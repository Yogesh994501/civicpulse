'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';

export const SearchInput: React.FC = () => {
  const { searchQuery, setSearchQuery } = useCivicPulse();

  return (
    <div className="relative flex-1 min-w-[240px] max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by ID, street, neighborhood, title..."
        className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
