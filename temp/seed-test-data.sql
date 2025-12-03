-- Enable UUID & PostGIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-------------------------------------------------
-- INSERT ADMIN (if not exists)
-------------------------------------------------
INSERT INTO admins (
  id, name, email, password_hash, role, created_at, updated_at
)
VALUES (
  uuid_generate_v4(),
  'Super Admin',
  'admin@events.com',
  '$2b$10$hUcMopjGFXEGHR/.ceI8sOWlNh3y5OW7CwK0DuCOFX2aZ4u.3LMLe', -- admin123
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-------------------------------------------------
-- INSERT ORGANIZER (if not exists)
-------------------------------------------------
INSERT INTO organizers (
  id, name, email, password_hash, "isActive", created_at, updated_at
)
VALUES (
  uuid_generate_v4(),
  'Test Organizer',
  'organizer@events.com',
  '$2b$10$NReAWRMRmAtcziZtu75NzOnaN9NvrWDVp.EYJDQN84fjdXuGzV3xS', -- organizer123
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-------------------------------------------------
-- INSERT EVENTS
-------------------------------------------------
WITH org AS (
  SELECT id FROM organizers WHERE email = 'organizer@events.com'
)
INSERT INTO events (
  id, title, description, "startDate", "endDate", category,
  "priceInfo", "locationName", address, latitude, longitude,
  location, "organizerName", website, images, status,
  "adminComment", "organizerId", "createdAt", "updatedAt"
)
VALUES
-- Pending
(
  uuid_generate_v4(),
  'Wil City Festival',
  'A fun local gathering with music and food trucks.',
  '2025-12-10T14:00:00Z',
  '2025-12-10T20:00:00Z',
  'Festival',
  'Free entry',
  'Stadt Wil Zentrum',
  'Marktplatz 1, 9500 Wil',
  47.4633, 9.0458,
  ST_SetSRID(ST_MakePoint(9.0458, 47.4633), 4326),
  'Test Organizer',
  'https://example.com/festival',
  ARRAY['https://picsum.photos/400/200?random=1'],
  'pending',
  NULL,
  (SELECT id FROM org),
  NOW(),
  NOW()
),
-- Rejected
(
  uuid_generate_v4(),
  'Outdoor Night Party',
  'Late night party with DJ.',
  '2025-12-20T18:00:00Z',
  '2025-12-20T23:00:00Z',
  'Party',
  'CHF 10',
  'Wil Lakeside',
  'Seestrasse 10, 9500 Wil',
  47.4605, 9.0501,
  ST_SetSRID(ST_MakePoint(9.0501, 47.4605), 4326),
  'Test Organizer',
  'https://example.com/nightparty',
  ARRAY['https://picsum.photos/400/200?random=2'],
  'rejected',
  'Noise disturbance concerns',
  (SELECT id FROM org),
  NOW(),
  NOW()
),
-- Approved
(
  uuid_generate_v4(),
  'Wil Christmas Market',
  'Traditional Christmas market.',
  '2025-12-05T10:00:00Z',
  '2025-12-05T18:00:00Z',
  'Market',
  NULL,
  'Altstadt Wil',
  'Hauptplatz 5, 9500 Wil',
  47.4671, 9.0467,
  ST_SetSRID(ST_MakePoint(9.0467, 47.4671), 4326),
  'Test Organizer',
  'https://example.com/christmasmarket',
  ARRAY['https://picsum.photos/400/200?random=3'],
  'approved',
  NULL,
  (SELECT id FROM org),
  NOW(),
  NOW()
),
(
  uuid_generate_v4(),
  'Winter Charity Run',
  '5 km charity run for local causes.',
  '2026-01-15T09:00:00Z',
  '2026-01-15T11:00:00Z',
  'Sport',
  'Donation based',
  'Wil Park Stadion',
  'Bahnhofstrasse 20, 9500 Wil',
  47.4667, 9.0388,
  ST_SetSRID(ST_MakePoint(9.0388, 47.4667), 4326),
  'Test Organizer',
  NULL,
  ARRAY['https://picsum.photos/400/200?random=4'],
  'approved',
  NULL,
  (SELECT id FROM org),
  NOW(),
  NOW()
);


-- docker exec -i postgres psql -U postgres -d eventfinder < seed-test-data.sql
-- oder psql -U postgres -d eventfinder -f temp/seed-test-data.sql