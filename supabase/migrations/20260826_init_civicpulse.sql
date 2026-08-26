-- ==============================================================================
-- CivicPulse — Municipal Operations & Real-Time Incident Command Database Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('citizen', 'operator', 'admin', 'crew')) DEFAULT 'citizen',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Maintenance Taskforce Crews Table
CREATE TABLE IF NOT EXISTS public.crews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    status TEXT CHECK (status IN ('available', 'deployed', 'en_route', 'on_site', 'offline')) DEFAULT 'available',
    members_count INT DEFAULT 4,
    vehicle_type TEXT,
    lead_name TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    speed_kmh INT DEFAULT 0,
    current_incident_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Incidents Table (Primary Command Center Entity)
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('road_repairs', 'waste_management', 'streetlighting', 'park_maintenance')) NOT NULL,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'resolved')) DEFAULT 'pending',
    neighborhood TEXT NOT NULL,
    street TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    map_x NUMERIC(5, 2) DEFAULT 50.0,
    map_y NUMERIC(5, 2) DEFAULT 50.0,
    reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_crew_id UUID REFERENCES public.crews(id) ON DELETE SET NULL,
    upvotes INT DEFAULT 0,
    sla_total_minutes INT DEFAULT 240,
    sla_remaining_minutes INT DEFAULT 240,
    photo_url TEXT,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Incident Resolution Timeline Events Table
CREATE TABLE IF NOT EXISTS public.incident_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    stage TEXT CHECK (stage IN ('citizen_report', 'ai_verification', 'crew_dispatched', 'field_resolution')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('Completed', 'In Progress', 'Pending')) NOT NULL,
    timestamp_label TEXT NOT NULL,
    relative_time TEXT NOT NULL,
    assigned_team TEXT NOT NULL,
    crew_id UUID REFERENCES public.crews(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Incident Upvotes Table (Prevents Double Voting)
CREATE TABLE IF NOT EXISTS public.incident_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(incident_id, user_id)
);

-- 7. Incident Media Records Table
CREATE TABLE IF NOT EXISTS public.incident_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    media_type TEXT DEFAULT 'image/jpeg',
    media_category TEXT CHECK (media_category IN ('report_photo', 'before', 'after', 'verification')) DEFAULT 'report_photo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_incidents_category ON public.incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON public.incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_neighborhood ON public.incidents(neighborhood);
CREATE INDEX IF NOT EXISTS idx_timeline_incident_id ON public.incident_timeline(incident_id);
CREATE INDEX IF NOT EXISTS idx_votes_incident_user ON public.incident_votes(incident_id, user_id);
CREATE INDEX IF NOT EXISTS idx_crews_status ON public.crews(status);

-- ==============================================================================
-- 9. Automatic Upvote Counter Trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.sync_incident_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.incidents
        SET upvotes = upvotes + 1
        WHERE id = NEW.incident_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.incidents
        SET upvotes = GREATEST(0, upvotes - 1)
        WHERE id = OLD.incident_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_incident_upvotes ON public.incident_votes;
CREATE TRIGGER trigger_sync_incident_upvotes
AFTER INSERT OR DELETE ON public.incident_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_incident_upvotes_count();

-- ==============================================================================
-- 10. Enable Row Level Security (RLS) on All Tables
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_media ENABLE ROW LEVEL SECURITY;

-- 11. Comprehensive RLS Policies
-- Profiles: Public read, User can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Crews: Viewable by everyone, editable by operators/admins
CREATE POLICY "Crews are viewable by everyone" ON public.crews FOR SELECT USING (true);
CREATE POLICY "Operators and admins can manage crews" ON public.crews FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'admin'))
);

-- Incidents: Viewable by everyone, Authenticated users can insert
CREATE POLICY "Incidents are viewable by everyone" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report incidents" ON public.incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Operators, crews, and admins can update incidents" ON public.incidents FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'admin', 'crew')) OR
    reported_by = auth.uid()
);

-- Incident Timeline: Viewable by everyone
CREATE POLICY "Timeline events are viewable by everyone" ON public.incident_timeline FOR SELECT USING (true);
CREATE POLICY "Authenticated users and workers can insert timeline events" ON public.incident_timeline FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Operators and crews can update timeline events" ON public.incident_timeline FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'admin', 'crew'))
);

-- Incident Votes: Viewable by everyone, User can insert/delete own vote
CREATE POLICY "Votes are viewable by everyone" ON public.incident_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vote" ON public.incident_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own vote" ON public.incident_votes FOR DELETE USING (auth.uid() = user_id);

-- Incident Media: Viewable by everyone, Authenticated users can upload
CREATE POLICY "Media records are viewable by everyone" ON public.incident_media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert media records" ON public.incident_media FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==============================================================================
-- 12. Supabase Storage Bucket Configuration (incident-media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('incident-media', 'incident-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Incident media images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'incident-media');

CREATE POLICY "Authenticated users can upload incident media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'incident-media' AND auth.role() = 'authenticated');
