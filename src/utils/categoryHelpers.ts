import { Category, Severity, IncidentStatus } from '@/types/incident';
import { 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Trees, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Truck
} from 'lucide-react';
import React from 'react';

export const getCategoryMeta = (category: Category) => {
  switch (category) {
    case 'road_repairs':
      return {
        label: 'Road Repairs',
        color: '#F59E0B',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        glowColor: 'glow-amber',
        accentHex: '#F59E0B',
        icon: AlertTriangle,
      };
    case 'waste_management':
      return {
        label: 'Waste Management',
        color: '#10B981',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        glowColor: 'glow-emerald',
        accentHex: '#10B981',
        icon: Trash2,
      };
    case 'streetlighting':
      return {
        label: 'Streetlighting',
        color: '#06B6D4',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
        glowColor: 'glow-cyan',
        accentHex: '#06B6D4',
        icon: Lightbulb,
      };
    case 'park_maintenance':
      return {
        label: 'Park Maintenance',
        color: '#F43F5E',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        glowColor: 'glow-rose',
        accentHex: '#F43F5E',
        icon: Trees,
      };
  }
};

export const getSeverityMeta = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critical',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        glowClass: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
        color: '#EF4444',
      };
    case 'high':
      return {
        label: 'High',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        color: '#F59E0B',
      };
    case 'medium':
      return {
        label: 'Medium',
        badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        glowClass: 'shadow-[0_0_10px_rgba(6,182,212,0.4)]',
        color: '#06B6D4',
      };
    case 'low':
      return {
        label: 'Low',
        badgeClass: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
        glowClass: 'shadow-[0_0_8px_rgba(161,161,170,0.3)]',
        color: '#71717A',
      };
  }
};

export const getStatusMeta = (status: IncidentStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Dispatched',
        icon: Truck,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 'in_progress':
      return {
        label: 'Investigating',
        icon: Clock,
        badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 animate-pulse',
      };
    case 'resolved':
      return {
        label: 'Fixed',
        icon: CheckCircle2,
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      };
  }
};

export const formatSecondsToCountdown = (seconds: number): string => {
  if (seconds <= 0) return '00:00:00 (SLA Met / Resolved)';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatSecondsToShortText = (seconds: number): string => {
  if (seconds <= 0) return '0m left';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins}m left`;
  }
  return `${mins}m left`;
};
