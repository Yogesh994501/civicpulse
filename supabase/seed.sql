-- ==============================================================================
-- CivicPulse Initial Seed Data (Mumbai Sector H-West)
-- ==============================================================================

-- 1. Insert Initial Maintenance Taskforce Crews
INSERT INTO public.crews (id, crew_code, name, specialization, status, members_count, vehicle_type, lead_name, latitude, longitude, speed_kmh)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'CR-04', 'Rapid Asphalt Response Taskforce Alpha', 'Road Infrastructure', 'on_site', 6, 'Heavy Compactor & Bitumen Sprayer #09', 'R. K. Shinde (Field Engineer)', 19.0594, 72.8291, 0),
    ('22222222-2222-2222-2222-222222222222', 'SW-12', 'Solid Waste Mechanized Unit', 'Sanitation & Drainage', 'en_route', 4, 'Hydraulic Compactor Truck #402', 'Vikas Patil (Sanitation Lead)', 19.0650, 72.8310, 24),
    ('33333333-3333-3333-3333-333333333333', 'LT-08', 'Grid Power & Luminaire Squad', 'Power & Streetlighting', 'deployed', 3, 'Telescopic Crane Bucket Truck #19', 'A. Qureshi (Grid Supervisor)', 19.0810, 72.8250, 18),
    ('44444444-4444-4444-4444-444444444444', 'PK-03', 'Horticulture & Park Infrastructure Unit', 'Parks & Playgrounds', 'on_site', 4, 'Utility Maintenance Van #07', 'Suresh K. (Maintenance Lead)', 19.0490, 72.8222, 0),
    ('55555555-5555-5555-5555-555555555555', 'DR-01', 'High-Discharge De-watering Mobile Taskforce', 'Disaster & Drainage', 'on_site', 8, 'Diesel De-watering Pump Rig #03', 'Tariq Sheikh (Disaster Response)', 19.0725, 72.8790, 0),
    ('66666666-6666-6666-6666-666666666666', 'EN-02', 'Environmental Vigilance Taskforce', 'C&D Waste Enforcement', 'available', 5, 'Earthmover & Tipper Dumper #11', 'A. Rao (Vigilance Inspector)', 19.0620, 72.8282, 0)
ON CONFLICT (crew_code) DO NOTHING;

-- 2. Insert Incidents
INSERT INTO public.incidents (
    id, incident_code, title, description, category, severity, status, neighborhood, street, latitude, longitude, map_x, map_y, assigned_crew_id, upvotes, sla_total_minutes, sla_remaining_minutes, photo_url
) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'CP-2026-001',
    'Severe Craters & Road Subsidence Causing Traffic Bottleneck',
    'Deep 3-foot wide asphalt fissure and crater causing acute traffic tailback on Linking Road northbound. Multiple two-wheelers skidding during peak transit hours.',
    'road_repairs',
    'critical',
    'in_progress',
    'Bandra West',
    'Linking Road, Junction near National College',
    19.0596,
    72.8295,
    38.0,
    34.0,
    '11111111-1111-1111-1111-111111111111',
    42,
    240,
    97,
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
),
(
    'b2222222-2222-2222-2222-222222222222',
    'CP-2026-002',
    'Overflowing Commercial Dumpster & Storm Drain Blockage',
    'Secondary community waste bins overflowing onto footpath and stormwater drain entrance. Potential biohazard and vector breeding risk in dense commercial alley.',
    'waste_management',
    'high',
    'in_progress',
    'Khar Danda',
    '14th Road, Near Fish Market Corner',
    19.0684,
    72.8338,
    54.0,
    22.0,
    '22222222-2222-2222-2222-222222222222',
    28,
    300,
    120,
    'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80'
),
(
    'c3333333-3333-3333-3333-333333333333',
    'CP-2026-003',
    'High-Mast Dark Zone — 6 Adjacent Sodium Lamps Blown',
    'Complete 200-meter dark corridor on school perimeter road due to a suspected feeder box breaker trip. Poses acute pedestrian safety and security risks after dusk.',
    'streetlighting',
    'high',
    'pending',
    'Santacruz West',
    'Juhu Tara Road, Stretch near St. Joseph Convent',
    19.0833,
    72.8277,
    26.0,
    68.0,
    '33333333-3333-3333-3333-333333333333',
    35,
    180,
    40,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
),
(
    'd4444444-4444-4444-4444-444444444444',
    'CP-2026-004',
    'Broken Children Play Structure & Exposed Sharp Metal',
    'Fractured stainless steel swing chain and rusted climbing frame crossbar with exposed sharp edges inside the public children play enclosure.',
    'park_maintenance',
    'medium',
    'in_progress',
    'Bandra Reclamation',
    'Joggers Park Promenade, Sector 3',
    19.0492,
    72.8220,
    70.0,
    76.0,
    '44444444-4444-4444-4444-444444444444',
    19,
    360,
    180,
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80'
),
(
    'e5555555-5555-5555-5555-555555555555',
    'CP-2026-005',
    'Severe Monsoon Waterlogging & Submerged Manhole',
    '2.5-foot standing waterlogged zone across both lanes of LBS Marg. Missing manhole cover beneath muddy water posing extreme danger to motor vehicles and pedestrians.',
    'road_repairs',
    'critical',
    'in_progress',
    'Kurla West',
    'LBS Marg, Near Phoenix Crossing',
    19.0728,
    72.8795,
    82.0,
    40.0,
    '55555555-5555-5555-5555-555555555555',
    56,
    240,
    30,
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
),
(
    'f6666666-6666-6666-6666-666666666666',
    'CP-2026-006',
    'Unauthorized Toxic Debris & Construction Waste Dump',
    'Illegally dumped demolition concrete debris, broken asbestos tiles, and wet plaster blocking pedestrian sidewalk path in residential enclave.',
    'waste_management',
    'low',
    'resolved',
    'Pali Hill',
    'Nargis Dutt Road, Near Water Reservoir',
    19.0621,
    72.8280,
    44.0,
    52.0,
    '66666666-6666-6666-6666-666666666666',
    14,
    480,
    0,
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (incident_code) DO NOTHING;

-- 3. Insert Resolution Timeline Steps for Incident CP-2026-001
INSERT INTO public.incident_timeline (incident_id, step_number, stage, title, description, status, timestamp_label, relative_time, assigned_team, crew_id, metadata)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    1,
    'citizen_report',
    'Citizen Report Submitted',
    'Multi-point citizen report received with geotagged photos confirming road crater near National College.',
    'Completed',
    '19:42 IST',
    '48m ago',
    'Citizen Dispatch Portal',
    NULL,
    '{"verified": true}'::jsonb
),
(
    'a1111111-1111-1111-1111-111111111111',
    2,
    'ai_verification',
    'Municipal Triage & AI Verification',
    'Pulse AI Vision Core flagged severe roadbed collapse (98.6% Confidence). Code-Red SLA assigned.',
    'Completed',
    '19:45 IST',
    '45m ago',
    'Pulse AI Vision Core',
    NULL,
    '{"confidence": 98.6, "ai_verified": true}'::jsonb
),
(
    'a1111111-1111-1111-1111-111111111111',
    3,
    'crew_dispatched',
    'Crew Dispatched',
    'Unit CR-04 mobilized with asphalt mill, roller compactor, and quick-setting thermoplastic compound.',
    'In Progress',
    '19:50 IST',
    '40m ago',
    'Rapid Asphalt Taskforce CR-04',
    '11111111-1111-1111-1111-111111111111',
    '{"gps_badge": "UNIT 04 · 0.2 KM AWAY (ON SITE)", "unit_code": "CR-04"}'::jsonb
),
(
    'a1111111-1111-1111-1111-111111111111',
    4,
    'field_resolution',
    'Field Resolution & Verification',
    'Excavation and hot-mix bitumen compaction in progress. Pavement leveling target Grade 0.',
    'In Progress',
    'Est. 20:45 IST',
    'Est. 35m remaining',
    'Municipal QA & Field Crew CR-04',
    '11111111-1111-1111-1111-111111111111',
    '{"before_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80", "after_url": "https://images.unsplash.com/photo-1578961955438-6da3ac975928?auto=format&fit=crop&w=600&q=80"}'::jsonb
)
ON CONFLICT DO NOTHING;
