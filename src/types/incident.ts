export type Category = "Road Repairs" | "Waste Management" | "Streetlighting" | "Park Maintenance";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type IncidentStatus = "Pending" | "In Progress" | "Resolved";

export interface CrewGpsBadge {
  unitId: string;
  crewName: string;
  leadName: string;
  coordinates: string;
  status: string;
  speedKmh?: number;
}

export interface PhotoVerification {
  beforeUrl?: string;
  afterUrl?: string;
  verifiedNote?: string;
  verifiedBy?: string;
}

export interface TimelineStep {
  id: string;
  stepNumber: number;
  stage: string;
  timestamp: string;
  relativeTime: string;
  status: "Completed" | "In Progress" | "Pending";
  assignedTeam: string;
  description: string;
  crewGpsBadge?: CrewGpsBadge;
  photoVerification?: PhotoVerification;
}

export interface IncidentContext {
  weather?: {
    temperature: number;
    condition: string;
    humidity?: number;
    windSpeedKmh?: number;
    airQualityIndex?: number;
  };
  location?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    postalCode?: string;
    region?: string;
  };
  aiVision?: {
    suggestedCategory?: Category;
    confidenceScore?: number;
    analysisSource?: string;
  };
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
  mapPosition: { x: number; y: number }; // Percentage on map (0-100)
  reportedAt: Date;
  slaTotal: number; // in seconds
  slaRemaining: number; // in seconds
  assignedCrew: string;
  assignedCrewDetails: {
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
  timeline: TimelineStep[];
  context?: IncidentContext;
}

export interface KPIStats {
  resolutionRate: number;
  resolutionDelta: number;
  avgSlaHours: number;
  isSlaImproving: boolean;
  activeCrewsCount: number;
  criticalIncidentsCount: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'dispatch' | 'status_change' | 'sla_warning' | 'report';
  message: string;
  incidentId?: string;
  category?: Category;
}

export interface ApiStatusSummary {
  locationStatus: 'online' | 'degraded' | 'offline';
  weatherStatus: 'online' | 'degraded' | 'offline';
  imageAnalysisStatus: 'online' | 'degraded' | 'offline';
  hasRapidApiKey: boolean;
  lastChecked: string;
}
