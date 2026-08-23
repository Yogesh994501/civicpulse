'use client';

import React from 'react';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { KPIStat } from './KPIStat';
import { 
  TrendingUp, 
  Clock, 
  Users2, 
  AlertOctagon 
} from 'lucide-react';

export const TelemetryBar: React.FC = () => {
  const { kpis } = useCivicPulse();

  return (
    <div className="w-full overflow-x-auto pb-1 pt-1 no-scrollbar">
      <div className="flex items-center gap-3 sm:gap-4 min-w-[780px] lg:min-w-0">
        {/* KPI 1: Resolution Rate */}
        <KPIStat
          label="Resolution Rate"
          value={`${kpis.resolutionRate}%`}
          trend={`+${kpis.resolutionDelta}%`}
          isPositiveTrend={true}
          icon={TrendingUp}
          accentColor="emerald"
          delay={0.1}
        />

        {/* KPI 2: Average SLA */}
        <KPIStat
          label="Average SLA"
          value={`${kpis.avgSlaHours}`}
          subValue="hrs"
          trend="Improving"
          isPositiveTrend={kpis.isSlaImproving}
          icon={Clock}
          accentColor="cyan"
          delay={0.15}
        />

        {/* KPI 3: Active Field Crews */}
        <KPIStat
          label="Active Field Crews"
          value={`${kpis.activeCrewsCount}`}
          subValue="units"
          badge="DEPLOYED"
          trend="100% telemetry online"
          isPositiveTrend={true}
          icon={Users2}
          accentColor="amber"
          delay={0.2}
        />

        {/* KPI 4: Critical Incidents */}
        <KPIStat
          label="Critical Incidents"
          value={`${kpis.criticalIncidentsCount}`}
          subValue="pending"
          badge="URGENT"
          trend={kpis.criticalIncidentsCount > 0 ? "Immediate dispatch" : "All clear"}
          isPositiveTrend={kpis.criticalIncidentsCount === 0}
          icon={AlertOctagon}
          accentColor="rose"
          delay={0.25}
        />
      </div>
    </div>
  );
};
