export type Category = 'road_repairs' | 'waste_management' | 'streetlighting' | 'park_maintenance';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'pending' | 'in_progress' | 'resolved';

export interface TimelineEvent {
  id: string;
  stepNumber: number;
  stage: string;
  timestamp: string;
  relativeTime: string;
  status: 'completed' | 'in_progress' | 'pending';
  responsibleTeam: string;
  description: string;
  verifiedBy?: string;
}

export interface Incident {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  status: IncidentStatus;
  neighborhood: string;
  streetName: string;
  coordinates: string;
  mapPosition: { x: number; y: number }; // percentages (0-100)
  reportedAt: string;
  slaTotalSeconds: number;
  slaRemainingSeconds: number;
  assignedCrew: {
    unitId: string;
    crewName: string;
    membersCount: number;
    vehicleType: string;
    status: 'Dispatched' | 'En Route' | 'On Site' | 'Resolved';
  };
  upvotes: number;
  hasUserUpvoted?: boolean;
  description: string;
  photoUrl?: string;
  timeline: TimelineEvent[];
}

export interface KPIStats {
  resolutionRate: number; // e.g. 84
  resolutionDelta: number; // e.g. +6.2
  avgSlaHours: number; // e.g. 3.8
  isSlaImproving: boolean;
  activeCrewsCount: number; // e.g. 14
  criticalIncidentsCount: number; // e.g. 3
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'dispatch' | 'status_change' | 'sla_warning' | 'report';
  message: string;
  incidentId?: string;
  category?: Category;
}
