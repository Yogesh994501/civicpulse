import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Incident, Category, Severity, IncidentStatus, TimelineStep, IncidentContext } from '@/types/incident';
import { INITIAL_INCIDENTS } from '@/data/mockIncidents';

// Category and Severity mapping helpers between Postgres enums and UI labels
export const mapDbCategoryToUi = (dbCat: string): Category => {
  switch (dbCat) {
    case 'road_repairs': return 'Road Repairs';
    case 'waste_management': return 'Waste Management';
    case 'streetlighting': return 'Streetlighting';
    case 'park_maintenance': return 'Park Maintenance';
    default: return 'Road Repairs';
  }
};

export const mapUiCategoryToDb = (uiCat: Category): string => {
  switch (uiCat) {
    case 'Road Repairs': return 'road_repairs';
    case 'Waste Management': return 'waste_management';
    case 'Streetlighting': return 'streetlighting';
    case 'Park Maintenance': return 'park_maintenance';
  }
};

export const mapDbSeverityToUi = (dbSev: string): Severity => {
  switch (dbSev) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return 'Medium';
  }
};

export const mapUiSeverityToDb = (uiSev: Severity): string => {
  return uiSev.toLowerCase();
};

export const mapDbStatusToUi = (dbStat: string): IncidentStatus => {
  switch (dbStat) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    default: return 'Pending';
  }
};

export const mapUiStatusToDb = (uiStat: IncidentStatus): string => {
  return uiStat === 'In Progress' ? 'in_progress' : uiStat.toLowerCase();
};

/**
 * Fetch all incidents with associated timeline steps and crews from Supabase
 */
export async function fetchIncidentsFromSupabase(): Promise<Incident[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return INITIAL_INCIDENTS;
  }

  try {
    const { data: incidentRows, error: incError } = await (supabase as any)
      .from('incidents')
      .select(`
        *,
        crews:assigned_crew_id (*),
        timeline:incident_timeline (*)
      `)
      .order('created_at', { ascending: false });

    if (incError || !incidentRows || incidentRows.length === 0) {
      console.warn('Supabase incidents fetch returned empty or error, using local dataset:', incError);
      return INITIAL_INCIDENTS;
    }

    return incidentRows.map((row: any): Incident => {
      const crew = row.crews;
      const timelineRows = Array.isArray(row.timeline) ? row.timeline : [];

      const formattedTimeline: TimelineStep[] = timelineRows
        .sort((a: any, b: any) => a.step_number - b.step_number)
        .map((t: any): TimelineStep => {
          const meta = t.metadata || {};
          return {
            id: t.id,
            stepNumber: t.step_number,
            stage: t.title,
            timestamp: t.timestamp_label,
            relativeTime: t.relative_time,
            status: t.status as 'Completed' | 'In Progress' | 'Pending',
            assignedTeam: t.assigned_team,
            description: t.description,
            crewGpsBadge: meta.gps_badge ? {
              unitId: meta.unit_code || crew?.crew_code || 'UNIT-01',
              crewName: crew?.name || 'Assigned Crew',
              leadName: crew?.lead_name || 'Field Duty Lead',
              coordinates: `${row.latitude}° N, ${row.longitude}° E`,
              status: meta.gps_badge,
              speedKmh: crew?.speed_kmh ?? 0,
            } : undefined,
            photoVerification: (meta.before_url || meta.after_url) ? {
              beforeUrl: meta.before_url || row.photo_url,
              afterUrl: meta.after_url,
              verifiedNote: meta.verified_note || 'Pavement & structure QA verified.',
              verifiedBy: meta.verified_by || 'Field QA Inspector',
            } : undefined,
          };
        });

      return {
        id: row.incident_code || `CP-${row.id.slice(0, 4)}`,
        title: row.title,
        category: mapDbCategoryToUi(row.category),
        severity: mapDbSeverityToUi(row.severity),
        status: mapDbStatusToUi(row.status),
        neighborhood: row.neighborhood,
        streetName: row.street,
        coordinates: `${Number(row.latitude).toFixed(4)}° N, ${Number(row.longitude).toFixed(4)}° E`,
        mapPosition: { x: Number(row.map_x) || 50, y: Number(row.map_y) || 50 },
        reportedAt: new Date(row.created_at),
        slaTotal: (row.sla_total_minutes || 240) * 60,
        slaRemaining: (row.sla_remaining_minutes || 240) * 60,
        assignedCrew: crew ? `${crew.crew_code}: ${crew.name}` : 'Unassigned Dispatch Queue',
        assignedCrewDetails: {
          unitId: crew?.crew_code || 'DISPATCH-QUEUE',
          crewName: crew?.name || 'Municipal Rapid Response',
          membersCount: crew?.members_count || 4,
          vehicleType: crew?.vehicle_type || 'Maintenance Vehicle',
          status: crew?.status === 'on_site' ? 'On Site' : crew?.status === 'en_route' ? 'En Route' : 'Dispatched',
        },
        upvotes: row.upvotes || 0,
        description: row.description,
        photoUrl: row.photo_url || undefined,
        timeline: formattedTimeline.length > 0 ? formattedTimeline : INITIAL_INCIDENTS[0].timeline,
        context: row.context as IncidentContext | undefined,
      };
    });
  } catch (err) {
    console.error('Error querying Supabase incidents:', err);
    return INITIAL_INCIDENTS;
  }
}

/**
 * Persist a newly created incident to Supabase with initial timeline events
 */
export async function createIncidentInSupabase(incidentData: {
  title: string;
  category: Category;
  severity: Severity;
  neighborhood: string;
  streetName: string;
  coordinates: string;
  description: string;
  photoUrl?: string;
  userId?: string;
  context?: IncidentContext;
}): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const incidentCode = `CP-${codeNumber}`;

    // Parse coordinates
    const parts = incidentData.coordinates.split(',');
    const lat = parseFloat(parts[0]) || 19.0596;
    const lon = parseFloat(parts[1]) || 72.8295;
    const randomX = Math.floor(20 + Math.random() * 60);
    const randomY = Math.floor(20 + Math.random() * 60);

    const slaHours = incidentData.severity === 'Critical' ? 4 : incidentData.severity === 'High' ? 6 : incidentData.severity === 'Medium' ? 12 : 24;

    const { data: newRow, error: insertError } = await (supabase as any)
      .from('incidents')
      .insert({
        incident_code: incidentCode,
        title: incidentData.title,
        description: incidentData.description,
        category: mapUiCategoryToDb(incidentData.category),
        severity: mapUiSeverityToDb(incidentData.severity),
        status: 'pending',
        neighborhood: incidentData.neighborhood,
        street: incidentData.streetName,
        latitude: lat,
        longitude: lon,
        map_x: randomX,
        map_y: randomY,
        reported_by: incidentData.userId || null,
        upvotes: 1,
        sla_total_minutes: slaHours * 60,
        sla_remaining_minutes: slaHours * 60,
        photo_url: incidentData.photoUrl || null,
        context: incidentData.context || null,
      })
      .select('id')
      .single();

    if (insertError || !newRow) {
      console.warn('Failed to insert incident to Supabase:', insertError);
      return null;
    }

    const incidentId = newRow.id;

    // Insert Stage 01 & 02 Timeline Events
    await (supabase as any).from('incident_timeline').insert([
      {
        incident_id: incidentId,
        step_number: 1,
        stage: 'citizen_report',
        title: 'Citizen Report Submitted',
        description: 'Incident verified and registered on live municipal radar stream with citizen photo telemetry.',
        status: 'Completed',
        timestamp_label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        relative_time: 'Just now',
        assigned_team: 'Citizen Dispatch Portal',
      },
      {
        incident_id: incidentId,
        step_number: 2,
        stage: 'ai_verification',
        title: 'Municipal Triage & AI Verification',
        description: `Automated triage assigned [${incidentData.severity.toUpperCase()}] priority. Target SLA: ${slaHours}h.`,
        status: 'Completed',
        timestamp_label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        relative_time: 'Just now',
        assigned_team: 'Pulse AI Vision Core',
        metadata: { confidence: 96.5, ai_verified: true },
      },
      {
        incident_id: incidentId,
        step_number: 3,
        stage: 'crew_dispatched',
        title: 'Crew Dispatched & Live Telemetry Locked',
        description: 'Field taskforce queued in dispatch queue for rapid mobilization.',
        status: 'In Progress',
        timestamp_label: 'In Progress',
        relative_time: 'Est. 10m',
        assigned_team: 'Municipal Rapid Response',
      },
      {
        incident_id: incidentId,
        step_number: 4,
        stage: 'field_resolution',
        title: 'Field Resolution & Before/After Photo Verification',
        description: 'Physical inspection and remediation work pending field taskforce deployment.',
        status: 'Pending',
        timestamp_label: 'Pending',
        relative_time: `Est. ${slaHours}h`,
        assigned_team: 'Municipal Field Operations',
      }
    ]);

    return incidentCode;
  } catch (err) {
    console.error('Error creating Supabase incident:', err);
    return null;
  }
}

/**
 * Toggle upvote in Supabase incident_votes table
 */
export async function toggleUpvoteInSupabase(incidentCode: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return true;

  try {
    // Find incident ID
    const { data: inc } = await (supabase as any)
      .from('incidents')
      .select('id')
      .eq('incident_code', incidentCode)
      .single();

    if (!inc) return true;

    // Check if vote exists
    const { data: existingVote } = await (supabase as any)
      .from('incident_votes')
      .select('id')
      .eq('incident_id', inc.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingVote) {
      await (supabase as any).from('incident_votes').delete().eq('id', existingVote.id);
    } else {
      await (supabase as any).from('incident_votes').insert({
        incident_id: inc.id,
        user_id: userId,
      });
    }

    return true;
  } catch (err) {
    console.warn('Error toggling vote in Supabase:', err);
    return true;
  }
}

/**
 * Upload image file to Supabase Storage bucket `incident-media`
 */
export async function uploadIncidentMediaToSupabase(file: File): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('incident-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.warn('Storage upload error:', uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('incident-media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Error uploading media to Supabase storage:', err);
    return null;
  }
}
