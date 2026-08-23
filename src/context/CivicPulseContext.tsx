'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Incident, Category, IncidentStatus, KPIStats, TelemetryLog } from '@/types/incident';
import { INITIAL_INCIDENTS, INITIAL_KPIS } from '@/data/mockIncidents';

interface ToastData {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'alert';
}

interface CivicPulseContextType {
  incidents: Incident[];
  filteredIncidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  timelineModalIncident: Incident | null;
  setTimelineModalIncident: (incident: Incident | null) => void;
  isReportDrawerOpen: boolean;
  setIsReportDrawerOpen: (open: boolean) => void;
  categoryFilter: 'all' | Category;
  setCategoryFilter: (category: 'all' | Category) => void;
  statusFilter: 'all' | IncidentStatus;
  setStatusFilter: (status: 'all' | IncidentStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  upvoteIncident: (id: string) => void;
  addNewIncident: (data: {
    title: string;
    category: Category;
    severity: 'critical' | 'high' | 'medium' | 'low';
    neighborhood: string;
    streetName: string;
    coordinates: string;
    description: string;
    photoUrl?: string;
  }) => void;
  kpis: KPIStats;
  telemetryLogs: TelemetryLog[];
  toast: ToastData | null;
  showToast: (title: string, description: string, type?: ToastData['type']) => void;
  clearToast: () => void;
  radarScanning: boolean;
  setRadarScanning: (scanning: boolean | ((prev: boolean) => boolean)) => void;
}

const CivicPulseContext = createContext<CivicPulseContextType | undefined>(undefined);

export const CivicPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [timelineModalIncident, setTimelineModalIncident] = useState<Incident | null>(null);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarScanning, setRadarScanning] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    {
      id: 'log-1',
      timestamp: 'LIVE NOW',
      type: 'dispatch',
      message: 'Crew CR-04 compacting hot-mix bitumen at Linking Road Junction.',
      incidentId: 'CP-8402',
      category: 'road_repairs',
    },
    {
      id: 'log-2',
      timestamp: '2m ago',
      type: 'status_change',
      message: 'Hydraulic Compactor SW-12 reported arrival at Khar 14th Road.',
      incidentId: 'CP-8395',
      category: 'waste_management',
    },
    {
      id: 'log-3',
      timestamp: '4m ago',
      type: 'sla_warning',
      message: 'Emergency De-watering Unit DR-01 locked manhole grid on LBS Marg.',
      incidentId: 'CP-8344',
      category: 'road_repairs',
    },
  ]);

  const showToast = useCallback((title: string, description: string, type: ToastData['type'] = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      title,
      description,
      type,
    });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // 1-second live countdown timer for SLAs
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === 'resolved' || inc.slaRemainingSeconds <= 0) return inc;
          return {
            ...inc,
            slaRemainingSeconds: Math.max(0, inc.slaRemainingSeconds - 1),
          };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated periodic telemetry updates (every 22 seconds)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const messages = [
        { text: 'Smart City CMS lumen telemetry stabilized on Bandra grid.', type: 'status_change' as const, cat: 'streetlighting' as Category },
        { text: 'Automated civic triage processed 3 citizen validation votes.', type: 'report' as const, cat: 'park_maintenance' as Category },
        { text: 'Rapid Asphalt Unit #02 completed thermal scanning on SV Road.', type: 'dispatch' as const, cat: 'road_repairs' as Category },
        { text: 'H-West Ward Command synchronized 14 active GPS field units.', type: 'dispatch' as const, cat: 'waste_management' as Category },
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newLog: TelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        type: randomMsg.type,
        message: randomMsg.text,
        category: randomMsg.cat,
      };
      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }, 22000);

    return () => clearInterval(telemetryInterval);
  }, []);

  // Upvoting handler
  const upvoteIncident = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const isUpvoted = inc.hasUserUpvoted;
          const newCount = isUpvoted ? inc.upvotes - 1 : inc.upvotes + 1;
          return {
            ...inc,
            upvotes: newCount,
            hasUserUpvoted: !isUpvoted,
          };
        }
        return inc;
      })
    );

    // Keep selectedIncident synchronized
    setSelectedIncident((prev) => {
      if (prev && prev.id === id) {
        const isUpvoted = prev.hasUserUpvoted;
        return {
          ...prev,
          upvotes: isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          hasUserUpvoted: !isUpvoted,
        };
      }
      return prev;
    });
  }, []);

  // Add new incident from 3-step report drawer
  const addNewIncident = useCallback(
    (data: {
      title: string;
      category: Category;
      severity: 'critical' | 'high' | 'medium' | 'low';
      neighborhood: string;
      streetName: string;
      coordinates: string;
      description: string;
      photoUrl?: string;
    }) => {
      const newIdNumber = Math.floor(1000 + Math.random() * 9000);
      const newId = `CP-${newIdNumber}`;
      
      const defaultCrewMap: Record<Category, { unitId: string; crewName: string; membersCount: number; vehicleType: string }> = {
        road_repairs: { unitId: `CR-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Rapid Asphalt Taskforce', membersCount: 5, vehicleType: 'Pavement Roller & Patch Rig' },
        waste_management: { unitId: `SW-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Solid Waste Rapid Cleansing', membersCount: 4, vehicleType: 'Compactor Truck' },
        streetlighting: { unitId: `LT-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Power & Luminaire Repair', membersCount: 3, vehicleType: 'Bucket Crane Van' },
        park_maintenance: { unitId: `PK-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Parks & Infrastructure Crew', membersCount: 4, vehicleType: 'Municipal Utility Truck' },
      };

      const crew = defaultCrewMap[data.category];

      // Coordinates random offset within map visual bounds
      const randomX = Math.floor(20 + Math.random() * 60);
      const randomY = Math.floor(20 + Math.random() * 60);

      const slaHours = data.severity === 'critical' ? 4 : data.severity === 'high' ? 6 : data.severity === 'medium' ? 12 : 24;
      const slaTotalSeconds = slaHours * 3600;

      const newIncident: Incident = {
        id: newId,
        title: data.title,
        category: data.category,
        severity: data.severity,
        status: 'pending',
        neighborhood: data.neighborhood,
        streetName: data.streetName,
        coordinates: data.coordinates,
        mapPosition: { x: randomX, y: randomY },
        reportedAt: new Date().toISOString(),
        slaTotalSeconds,
        slaRemainingSeconds: slaTotalSeconds,
        assignedCrew: {
          ...crew,
          status: 'Dispatched',
        },
        upvotes: 1,
        hasUserUpvoted: true,
        description: data.description,
        photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        timeline: [
          {
            id: `t-${Date.now()}-1`,
            stepNumber: 1,
            stage: 'Citizen Issue Reported',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
            relativeTime: 'Just now',
            status: 'completed',
            responsibleTeam: 'Citizen Dispatch Portal',
            description: 'Incident verified and registered on live municipal radar stream.',
          },
          {
            id: `t-${Date.now()}-2`,
            stepNumber: 2,
            stage: 'AI Computer Vision & Severity Triage',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
            relativeTime: 'Just now',
            status: 'completed',
            responsibleTeam: 'Pulse AI Vision Core',
            description: `Automated triage marked priority [${data.severity.toUpperCase()}]. Target SLA: ${slaHours}h.`,
          },
          {
            id: `t-${Date.now()}-3`,
            stepNumber: 3,
            stage: 'Emergency Dispatch Assignment',
            timestamp: 'In Progress',
            relativeTime: 'Est. 10m',
            status: 'in_progress',
            responsibleTeam: crew.crewName,
            description: `Unit ${crew.unitId} assigned with ${crew.membersCount} crew specialists.`,
          },
          {
            id: `t-${Date.now()}-4`,
            stepNumber: 4,
            stage: 'Field Crew Arrival & Inspection',
            timestamp: 'Pending',
            relativeTime: 'Est. 30m',
            status: 'pending',
            responsibleTeam: crew.crewName,
            description: 'On-site technical evaluation and containment setup.',
          },
          {
            id: `t-${Date.now()}-5`,
            stepNumber: 5,
            stage: 'Physical Repair & Execution',
            timestamp: 'Pending',
            relativeTime: `Est. ${Math.round(slaHours * 0.6)}h`,
            status: 'pending',
            responsibleTeam: 'Operations Field Taskforce',
            description: 'Core infrastructure restoration and remediation work.',
          },
          {
            id: `t-${Date.now()}-6`,
            stepNumber: 6,
            stage: 'Quality & Safety Certification',
            timestamp: 'Pending',
            relativeTime: `Est. ${Math.round(slaHours * 0.85)}h`,
            status: 'pending',
            responsibleTeam: 'Municipal QA Engineer',
            description: 'Inspection and verification against civic safety standards.',
          },
          {
            id: `t-${Date.now()}-7`,
            stepNumber: 7,
            stage: 'Citizen Re-confirmation & Closeout',
            timestamp: 'Pending',
            relativeTime: `Est. ${slaHours}h`,
            status: 'pending',
            responsibleTeam: 'Citizen Feedback Engine',
            description: 'Digital resolution broadcast and closure sign-off.',
          },
        ],
      };

      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncident(newIncident);

      // Add log
      const newLog: TelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        type: 'report',
        message: `New [${data.severity.toUpperCase()}] incident ${newId} logged in ${data.neighborhood}.`,
        incidentId: newId,
        category: data.category,
      };
      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 5)]);

      showToast(
        `Incident ${newId} Dispatched!`,
        `Assigned to ${crew.crewName} in ${data.neighborhood}. Beacon added to radar map.`,
        'success'
      );
    },
    [showToast]
  );

  // Dynamic KPI computation based on incidents
  const kpis: KPIStats = useMemo(() => {
    const total = incidents.length;
    const resolved = incidents.filter((i) => i.status === 'resolved').length;
    const critical = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length;
    const calculatedRate = total > 0 ? Math.round((resolved / total) * 100) : 84;
    
    return {
      resolutionRate: Math.max(78, calculatedRate + 25), // realistic weighted municipal rate
      resolutionDelta: 6.2,
      avgSlaHours: 3.8,
      isSlaImproving: true,
      activeCrewsCount: INITIAL_KPIS.activeCrewsCount + (total - INITIAL_INCIDENTS.length),
      criticalIncidentsCount: critical,
    };
  }, [incidents]);

  // Filtered incidents calculation
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesCategory = categoryFilter === 'all' || inc.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        inc.id.toLowerCase().includes(query) ||
        inc.title.toLowerCase().includes(query) ||
        inc.neighborhood.toLowerCase().includes(query) ||
        inc.streetName.toLowerCase().includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [incidents, categoryFilter, statusFilter, searchQuery]);

  return (
    <CivicPulseContext.Provider
      value={{
        incidents,
        filteredIncidents,
        selectedIncident,
        setSelectedIncident,
        timelineModalIncident,
        setTimelineModalIncident,
        isReportDrawerOpen,
        setIsReportDrawerOpen,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        upvoteIncident,
        addNewIncident,
        kpis,
        telemetryLogs,
        toast,
        showToast,
        clearToast,
        radarScanning,
        setRadarScanning,
      }}
    >
      {children}
    </CivicPulseContext.Provider>
  );
};

export const useCivicPulse = () => {
  const context = useContext(CivicPulseContext);
  if (!context) {
    throw new Error('useCivicPulse must be used within a CivicPulseProvider');
  }
  return context;
};
