-- Seed test data for EventFinder (MySQL)
-- Usage: docker exec -i mysql mysql -u mysql -pmysql eventfinder < temp/seed-test-data.sql

-- -----------------------------------------------
-- INSERT ADMIN (skip if email already exists)
-- -----------------------------------------------
INSERT IGNORE INTO `admins` (
    `id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`
)
VALUES (
    UUID(),
    'Super Admin',
    'admin@events.com',
    '$2b$10$hUcMopjGFXEGHR/.ceI8sOWlNh3y5OW7CwK0DuCOFX2aZ4u.3LMLe', -- admin123
    'admin',
    NOW(),
    NOW()
);

-- -----------------------------------------------
-- INSERT ORGANIZER (skip if email already exists)
-- -----------------------------------------------
INSERT IGNORE INTO `organizers` (
    `id`, `name`, `email`, `password_hash`, `isActive`, `email_verified`, `role`, `created_at`, `updated_at`
)
VALUES (
    UUID(),
    'Test Organizer',
    'organizer@events.com',
    '$2b$10$NReAWRMRmAtcziZtu75NzOnaN9NvrWDVp.EYJDQN84fjdXuGzV3xS', -- organizer123
    1,
    1,
    'organizer',
    NOW(),
    NOW()
);

-- -----------------------------------------------
-- INSERT EVENTS
-- -----------------------------------------------
SET @org_id = (SELECT `id` FROM `organizers` WHERE `email` = 'organizer@events.com');

INSERT INTO `events` (
    `id`, `title`, `description`, `startDate`, `endDate`, `category`,
    `priceInfo`, `locationName`, `address`, `latitude`, `longitude`,
    `organizerName`, `website`, `images`, `status`,
    `adminComment`, `organizerId`, `createdAt`, `updatedAt`
)
VALUES
-- Pending
(
    UUID(),
    'Wil City Festival',
    'A fun local gathering with music and food trucks.',
    '2025-12-10 14:00:00',
    '2025-12-10 20:00:00',
    'Festival',
    'Free entry',
    'Stadt Wil Zentrum',
    'Marktplatz 1, 9500 Wil',
    47.4633, 9.0458,
    'Test Organizer',
    'https://example.com/festival',
    '["https://picsum.photos/400/200?random=1"]',
    'pending',
    NULL,
    @org_id,
    NOW(),
    NOW()
),
-- Rejected
(
    UUID(),
    'Outdoor Night Party',
    'Late night party with DJ.',
    '2025-12-20 18:00:00',
    '2025-12-20 23:00:00',
    'Party',
    'CHF 10',
    'Wil Lakeside',
    'Seestrasse 10, 9500 Wil',
    47.4605, 9.0501,
    'Test Organizer',
    'https://example.com/nightparty',
    '["https://picsum.photos/400/200?random=2"]',
    'rejected',
    'Noise disturbance concerns',
    @org_id,
    NOW(),
    NOW()
),
-- Approved
(
    UUID(),
    'Wil Christmas Market',
    'Traditional Christmas market.',
    '2025-12-05 10:00:00',
    '2025-12-05 18:00:00',
    'Market',
    NULL,
    'Altstadt Wil',
    'Hauptplatz 5, 9500 Wil',
    47.4671, 9.0467,
    'Test Organizer',
    'https://example.com/christmasmarket',
    '["https://picsum.photos/400/200?random=3"]',
    'approved',
    NULL,
    @org_id,
    NOW(),
    NOW()
),
(
    UUID(),
    'Winter Charity Run',
    '5 km charity run for local causes.',
    '2026-01-15 09:00:00',
    '2026-01-15 11:00:00',
    'Sport',
    'Donation based',
    'Wil Park Stadion',
    'Bahnhofstrasse 20, 9500 Wil',
    47.4667, 9.0388,
    'Test Organizer',
    NULL,
    '["https://picsum.photos/400/200?random=4"]',
    'approved',
    NULL,
    @org_id,
    NOW(),
    NOW()
);

-- docker exec -i mysql mysql -u mysql -pmysql eventfinder < temp/seed-test-data.sql
