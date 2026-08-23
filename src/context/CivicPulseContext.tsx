'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Incident, Category, Severity, IncidentStatus, KPIStats, TelemetryLog } from '@/types/incident';
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
  categoryFilter: 'All' | Category;
  setCategoryFilter: (category: 'All' | Category) => void;
  statusFilter: 'All' | IncidentStatus;
  setStatusFilter: (status: 'All' | IncidentStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  upvoteIncident: (id: string) => void;
  addNewIncident: (data: {
    title: string;
    category: Category;
    severity: Severity;
    neighborhood: string;
    streetName: string;
    coordinates: string;
    description: string;
    photoUrl?: string;
  }) => boolean;
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
  const [categoryFilter, setCategoryFilter] = useState<'All' | Category>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | IncidentStatus>('All');
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
      category: 'Road Repairs',
    },
    {
      id: 'log-2',
      timestamp: '2m ago',
      type: 'status_change',
      message: 'Hydraulic Compactor SW-12 reported arrival at Khar 14th Road.',
      incidentId: 'CP-8395',
      category: 'Waste Management',
    },
    {
      id: 'log-3',
      timestamp: '4m ago',
      type: 'sla_warning',
      message: 'Emergency De-watering Unit DR-01 locked manhole grid on LBS Marg.',
      incidentId: 'CP-8344',
      category: 'Road Repairs',
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

  // 1-second interval ticking down SLA remaining times
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === 'Resolved' || inc.slaRemaining <= 0) return inc;
          return {
            ...inc,
            slaRemaining: Math.max(0, inc.slaRemaining - 1),
          };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic telemetry updates (every 22 seconds)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const messages = [
        { text: 'Smart City CMS lumen telemetry stabilized on Bandra grid.', type: 'status_change' as const, cat: 'Streetlighting' as Category },
        { text: 'Automated civic triage processed 3 citizen validation votes.', type: 'report' as const, cat: 'Park Maintenance' as Category },
        { text: 'Rapid Asphalt Unit #02 completed thermal scanning on SV Road.', type: 'dispatch' as const, cat: 'Road Repairs' as Category },
        { text: 'H-West Ward Command synchronized 14 active GPS field units.', type: 'dispatch' as const, cat: 'Waste Management' as Category },
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

  // Upvoting handler: first click increments and activates, second click decrements
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

    // Keep selectedIncident in sync
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
      severity: Severity;
      neighborhood: string;
      streetName: string;
      coordinates: string;
      description: string;
      photoUrl?: string;
    }): boolean => {
      if (!data.title.trim() || !data.description.trim() || !data.streetName.trim()) {
        showToast('Validation Error', 'Please complete all required fields.', 'alert');
        return false;
      }

      const newIdNumber = Math.floor(1000 + Math.random() * 9000);
      const newId = `CP-${newIdNumber}`;
      
      const defaultCrewMap: Record<Category, { unitId: string; crewName: string; membersCount: number; vehicleType: string }> = {
        'Road Repairs': { unitId: `CR-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Rapid Asphalt Taskforce', membersCount: 5, vehicleType: 'Pavement Roller & Patch Rig' },
        'Waste Management': { unitId: `SW-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Solid Waste Rapid Cleansing', membersCount: 4, vehicleType: 'Compactor Truck' },
        'Streetlighting': { unitId: `LT-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Power & Luminaire Repair', membersCount: 3, vehicleType: 'Bucket Crane Van' },
        'Park Maintenance': { unitId: `PK-0${Math.floor(1 + Math.random() * 8)}`, crewName: 'Parks & Infrastructure Crew', membersCount: 4, vehicleType: 'Municipal Utility Truck' },
      };

      const crew = defaultCrewMap[data.category];
      const randomX = Math.floor(20 + Math.random() * 60);
      const randomY = Math.floor(20 + Math.random() * 60);

      const slaHours = data.severity === 'Critical' ? 4 : data.severity === 'High' ? 6 : data.severity === 'Medium' ? 12 : 24;
      const slaTotal = slaHours * 3600;

      const newIncident: Incident = {
        id: newId,
        title: data.title,
        category: data.category,
        severity: data.severity,
        status: 'Pending',
        neighborhood: data.neighborhood,
        streetName: data.streetName,
        coordinates: data.coordinates,
        mapPosition: { x: randomX, y: randomY },
        reportedAt: new Date(),
        slaTotal,
        slaRemaining: slaTotal,
        assignedCrew: `${crew.unitId}: ${crew.crewName}`,
        assignedCrewDetails: {
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
            stage: 'Citizen Report Submitted',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
            relativeTime: 'Just now',
            status: 'Completed',
            assignedTeam: 'Citizen Dispatch Portal',
            description: 'Incident verified and registered on live municipal radar stream with citizen photo telemetry.',
          },
          {
            id: `t-${Date.now()}-2`,
            stepNumber: 2,
            stage: 'Municipal Triage & AI Verification',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
            relativeTime: 'Just now',
            status: 'Completed',
            assignedTeam: 'Pulse AI Vision Core',
            description: `Automated triage assigned [${data.severity.toUpperCase()}] priority. Target SLA: ${slaHours}h.`,
          },
          {
            id: `t-${Date.now()}-3`,
            stepNumber: 3,
            stage: 'Crew Dispatched & Live Telemetry Locked',
            timestamp: 'In Progress',
            relativeTime: 'Est. 10m',
            status: 'In Progress',
            assignedTeam: crew.crewName,
            description: `Unit ${crew.unitId} mobilized with ${crew.membersCount} crew specialists.`,
            crewGpsBadge: {
              unitId: crew.unitId,
              crewName: crew.crewName,
              leadName: 'Field Duty Lead',
              coordinates: data.coordinates,
              status: 'EN ROUTE · DISPATCH ACTIVE',
              speedKmh: 20,
            },
          },
          {
            id: `t-${Date.now()}-4`,
            stepNumber: 4,
            stage: 'Field Resolution & Before/After Photo Verification',
            timestamp: 'Pending',
            relativeTime: `Est. ${slaHours}h`,
            status: 'Pending',
            assignedTeam: 'Municipal Field Operations',
            description: 'Physical inspection and remediation work pending field taskforce deployment.',
            photoVerification: {
              beforeUrl: data.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
              verifiedNote: 'Site remediation target queued in dispatch queue.',
            },
          },
        ],
      };

      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncident(newIncident);

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
      return true;
    },
    [showToast]
  );

  // Dynamic KPI computation based on incidents
  const kpis: KPIStats = useMemo(() => {
    const total = incidents.length;
    const resolved = incidents.filter((i) => i.status === 'Resolved').length;
    const critical = incidents.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;
    const calculatedRate = total > 0 ? Math.round((resolved / total) * 100) : 84;
    
    return {
      resolutionRate: Math.max(78, calculatedRate + 25),
      resolutionDelta: 6.2,
      avgSlaHours: 3.8,
      isSlaImproving: true,
      activeCrewsCount: INITIAL_KPIS.activeCrewsCount + (total - INITIAL_INCIDENTS.length),
      criticalIncidentsCount: critical,
    };
  }, [incidents]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
      
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
