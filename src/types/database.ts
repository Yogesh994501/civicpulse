export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'citizen' | 'operator' | 'admin' | 'crew'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'citizen' | 'operator' | 'admin' | 'crew'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'citizen' | 'operator' | 'admin' | 'crew'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      crews: {
        Row: {
          id: string
          crew_code: string
          name: string
          specialization: string
          status: 'available' | 'deployed' | 'en_route' | 'on_site' | 'offline'
          members_count: number
          vehicle_type: string | null
          lead_name: string | null
          latitude: number | null
          longitude: number | null
          speed_kmh: number | null
          current_incident_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          crew_code: string
          name: string
          specialization: string
          status?: 'available' | 'deployed' | 'en_route' | 'on_site' | 'offline'
          members_count?: number
          vehicle_type?: string | null
          lead_name?: string | null
          latitude?: number | null
          longitude?: number | null
          speed_kmh?: number | null
          current_incident_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          crew_code?: string
          name?: string
          specialization?: string
          status?: 'available' | 'deployed' | 'en_route' | 'on_site' | 'offline'
          members_count?: number
          vehicle_type?: string | null
          lead_name?: string | null
          latitude?: number | null
          longitude?: number | null
          speed_kmh?: number | null
          current_incident_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      incidents: {
        Row: {
          id: string
          incident_code: string
          title: string
          description: string
          category: 'road_repairs' | 'waste_management' | 'streetlighting' | 'park_maintenance'
          severity: 'critical' | 'high' | 'medium' | 'low'
          status: 'pending' | 'in_progress' | 'resolved'
          neighborhood: string
          street: string
          latitude: number
          longitude: number
          map_x: number
          map_y: number
          reported_by: string | null
          assigned_crew_id: string | null
          upvotes: number
          sla_total_minutes: number
          sla_remaining_minutes: number
          photo_url: string | null
          context: Json | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          incident_code: string
          title: string
          description: string
          category: 'road_repairs' | 'waste_management' | 'streetlighting' | 'park_maintenance'
          severity: 'critical' | 'high' | 'medium' | 'low'
          status?: 'pending' | 'in_progress' | 'resolved'
          neighborhood: string
          street: string
          latitude: number
          longitude: number
          map_x?: number
          map_y?: number
          reported_by?: string | null
          assigned_crew_id?: string | null
          upvotes?: number
          sla_total_minutes?: number
          sla_remaining_minutes?: number
          photo_url?: string | null
          context?: Json | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          incident_code?: string
          title?: string
          description?: string
          category?: 'road_repairs' | 'waste_management' | 'streetlighting' | 'park_maintenance'
          severity?: 'critical' | 'high' | 'medium' | 'low'
          status?: 'pending' | 'in_progress' | 'resolved'
          neighborhood?: string
          street?: string
          latitude?: number
          longitude?: number
          map_x?: number
          map_y?: number
          reported_by?: string | null
          assigned_crew_id?: string | null
          upvotes?: number
          sla_total_minutes?: number
          sla_remaining_minutes?: number
          photo_url?: string | null
          context?: Json | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      incident_timeline: {
        Row: {
          id: string
          incident_id: string
          step_number: number
          stage: 'citizen_report' | 'ai_verification' | 'crew_dispatched' | 'field_resolution'
          title: string
          description: string
          status: 'Completed' | 'In Progress' | 'Pending'
          timestamp_label: string
          relative_time: string
          assigned_team: string
          crew_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          incident_id: string
          step_number: number
          stage: 'citizen_report' | 'ai_verification' | 'crew_dispatched' | 'field_resolution'
          title: string
          description: string
          status: 'Completed' | 'In Progress' | 'Pending'
          timestamp_label: string
          relative_time: string
          assigned_team: string
          crew_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          incident_id?: string
          step_number?: number
          stage?: 'citizen_report' | 'ai_verification' | 'crew_dispatched' | 'field_resolution'
          title?: string
          description?: string
          status?: 'Completed' | 'In Progress' | 'Pending'
          timestamp_label?: string
          relative_time?: string
          assigned_team?: string
          crew_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      incident_votes: {
        Row: {
          id: string
          incident_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          incident_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          incident_id?: string
          user_id?: string
          created_at?: string
        }
      }
      incident_media: {
        Row: {
          id: string
          incident_id: string
          uploaded_by: string | null
          storage_path: string
          media_type: string
          media_category: 'report_photo' | 'before' | 'after' | 'verification'
          created_at: string
        }
        Insert: {
          id?: string
          incident_id: string
          uploaded_by?: string | null
          storage_path: string
          media_type?: string
          media_category?: 'report_photo' | 'before' | 'after' | 'verification'
          created_at?: string
        }
        Update: {
          id?: string
          incident_id?: string
          uploaded_by?: string | null
          storage_path?: string
          media_type?: string
          media_category?: 'report_photo' | 'before' | 'after' | 'verification'
          created_at?: string
        }
      }
    }
  }
}
