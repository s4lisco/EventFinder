# CLAUDE.md — Regional Events Web & Mobile App

## Projekt-Überblick
Eine Web- und Mobile-App zur Anzeige öffentlicher regionaler Events. Konsumenten entdecken Events in ihrer Nähe, Organisatoren können Events auf einer zentralen Plattform bewerben.

## Tech Stack
| Layer | Technologie |
|-------|-------------|
| Frontend | Next.js, React, Tailwind CSS, Mapbox |
| Backend | Node.js, NestJS, REST API |
| Datenbank | MySQL |
| Caching | Redis |
| E-Mail | Nodemailer (lokal: Mailhog, Prod: SMTP) |
| Deployment | Docker (lokal), Railway o.ä. (Produktion) |
| Monitoring | Grafana (geplant) |

## Lokales Setup
```bash
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d
# Testdaten laden (nur Development):
docker exec -i mysql mysql -u mysql -pmysql eventfinder < temp/seed-test-data.sql
```

Nach einem `docker-compose down --volumes` müssen alle Migrationen neu ausgeführt werden — das passiert beim ersten Start automatisch über den laufenden Backend-Container nicht. Manuell:
```bash
npm run build --prefix backend
DB_HOST=localhost npx --prefix backend typeorm migration:run -d backend/dist/data-source.js
```

## Architektur
- **Backend:** NestJS REST API auf Port 4000
- **Frontend:** Next.js auf Port 3000
- **DB:** MySQL mit Migrationen
- **Cache:** Redis (Container läuft, noch nicht im Code integriert)
- **Mail:** Mailhog auf Port 1025 (SMTP) / 8025 (Web-UI) für lokale Entwicklung

## Authentifizierung
- **Einheitlicher Login:** `POST /auth/login` — prüft zuerst `organizers`, dann `admins`-Tabelle
- **JWT-Payload:** `{ sub, email, role }` — role ist `'organizer'` oder `'admin'`
- **Redirect nach Login:** role=admin → `/admin/dashboard`, sonst → `/organizers/dashboard`
- **E-Mail-Verifizierung:** Organizer müssen ihre E-Mail bestätigen, bevor sie sich einloggen können
- Passwort-Hashing: bcryptjs, saltRounds=10

## Rollen & Zugriff
| Rolle | Herkunft | Zugriff |
|-------|----------|---------|
| `organizer` | `organizers`-Tabelle | Eigene Events verwalten |
| `admin` | `organizers`-Tabelle (role='admin') oder `admins`-Tabelle | Admin-Dashboard, Benutzerverwaltung |

Organizer können per Admin-Dashboard auf die Rolle `admin` hochgestuft werden.

## Datenbankschema (5 Tabellen, 8 Migrationen)
| Tabelle | Relevante Spalten |
|---------|------------------|
| `organizers` | id, name, email, password_hash, role, isActive, email_verified, email_verification_token |
| `events` | id, title, ..., status (pending/approved/rejected/archived), organizerId |
| `event_images` | id, eventId, storageKey, url, position |
| `admins` | id, name, email, password_hash, role |
| `migrations` | TypeORM-Migrationstabelle |

## Konventionen
- Mobile-first Design
- REST API (kein GraphQL)
- JWT in localStorage (nicht httpOnly — bekannte Schuld, für Prod umstellen)
- `req.user` aus JWT-Strategy hat Form `{ userId, email, role }` (nicht `sub`)
- Rollenbasierter Zugriff via `@Roles()`-Decorator + RolesGuard
- GDPR-konform (Datenexport & -löschung für Organizer — noch nicht implementiert)

## Wichtige API-Endpunkte
| Methode | Route | Auth | Beschreibung |
|---------|-------|------|-------------|
| POST | `/auth/login` | — | Unified Login (organizer + admin) |
| POST | `/organizers/signup` | — | Registrierung |
| GET | `/organizers/verify?token=` | — | E-Mail-Verifizierung |
| GET | `/admin/organizers` | Admin | Liste mit Pagination/Suche |
| PUT | `/admin/organizers/:id` | Admin | Name, E-Mail, isActive, role |
| DELETE | `/admin/organizers/:id` | Admin | Soft-Delete + Events archivieren |

## Frontend-Seiten
| Route | Beschreibung |
|-------|-------------|
| `/login` | Einheitliche Login-Seite (organizer + admin) |
| `/organizers/signup` | Registrierung |
| `/organizers/verify` | E-Mail-Bestätigung via Token |
| `/organizers/dashboard` | Eigene Events verwalten |
| `/organizers/events/create` | Event erstellen |
| `/organizers/events/[id]/edit` | Event bearbeiten |
| `/admin/dashboard` | Moderations-Dashboard |
| `/admin/organizers` | Benutzerverwaltung |

## PRD-Referenz
Das vollständige PRD liegt in `README.md` im Repo-Root.

## Aktueller Fokus
Phase 1 (MVP) — Kernfunktionen implementiert. Nächste Prioritäten:
- Redis-Caching für `GET /events`
- Pagination für `GET /events`
- Production-Deployment-Config (Railway, HTTPS, ENV-Secrets)
- GDPR: Datenexport & -löschung für Organizer
