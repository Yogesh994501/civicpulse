'use client';

import React from 'react';
import { IncidentStatus } from '@/types/incident';
import { getStatusMeta } from '@/utils/categoryHelpers';

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${meta.badgeClass}`}
    >
      <Icon className="w-3 h-3" />
      <span>{meta.label}</span>
    </span>
  );
};
