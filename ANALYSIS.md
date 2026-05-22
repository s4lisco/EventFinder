# EventFinder — Codebase Analysis & Go-Live Roadmap

> Zuletzt aktualisiert: 2026-04-18
> Branch: `feature/email-verification-admin-usermgmt`

---

## 1. Bestandsaufnahme

### Ordnerstruktur (Übersicht)

```
EventFinder/
├── backend/src/
│   ├── admin/          # Admin-Modul (Login, Event-Moderation, Benutzerverwaltung)
│   ├── auth/           # Unified Login, JWT-Strategie, Guards, Decorators
│   ├── events/         # Events CRUD, Bilder-Upload, Filter
│   ├── mail/           # E-Mail-Versand via Nodemailer (Verifizierungsmail)
│   ├── organizer/      # Organizer Signup/Login, E-Mail-Verifizierung, Events
│   ├── flyer/          # OCR/LLM-Extraktion (Groq/Llama 3.3 70b)
│   ├── filters/        # Globaler Exception-Filter
│   └── migrations/     # 8 TypeORM-Migrationen
├── frontend/src/
│   ├── pages/          # 12 Next.js-Seiten
│   ├── components/     # React-Komponenten
│   ├── hooks/          # Custom-Hooks (Datenabruf, Auth)
│   ├── types/          # TypeScript-Interfaces
│   └── utils/          # Hilfsfunktionen (Datum, Distanz, JWT)
├── docker/             # Dockerfiles Backend + Frontend
├── temp/               # SQL-Seed-Datei (Testdaten inkl. verifiziertem Organizer)
├── docker-compose.yml  # inkl. Mailhog-Service
└── README.md           # PRD
```

### Datenbankschema (4 Tabellen, 8 Migrationen)

| Tabelle | Beschreibung |
|---------|-------------|
| `organizers` | id, name, email, password_hash, **role**, isActive, **email_verified**, **email_verification_token** |
| `events` | Alle Felder + status enum: **pending/approved/rejected/archived** |
| `event_images` | Event-Bilder (storageKey, url, position) |
| `admins` | Admin-Accounts (UUID, name, email, password_hash, role) |

### API-Endpunkte (28 gesamt)

| Kategorie | Anzahl | Beispiele |
|-----------|--------|---------|
| Öffentlich | 6 | GET /events, POST /auth/login, POST /organizers/signup, GET /organizers/verify |
| Organizer (JWT) | 8 | POST /events, PUT /events/:id, DELETE /events/:id |
| Admin (JWT) | 14 | GET /admin/events, GET /admin/organizers, PUT /admin/organizers/:id, DELETE /admin/organizers/:id |

### Frontend-Seiten (12)

| Route | Beschreibung | Auth |
|-------|-------------|------|
| `/` | Karte + Listenansicht, Suche, Filter | Nein |
| `/events/[id]` | Event-Detailseite | Nein |
| `/login` | Unified Login (Organizer + Admin) | Nein |
| `/organizers/signup` | Registrierung | Nein |
| `/organizers/verify` | E-Mail-Bestätigung via Token | Nein |
| `/organizers/dashboard` | Eigene Events verwalten | Organizer |
| `/organizers/events/create` | Event erstellen | Organizer |
| `/organizers/events/[id]/edit` | Event bearbeiten | Organizer |
| `/admin/dashboard` | Moderations-Dashboard | Admin |
| `/admin/organizers` | Benutzerverwaltung | Admin |

---

## 2. PRD-Abgleich

### Section 3 — Primary Goals (MVP)

| Ziel | Status | Details |
|------|--------|---------|
| Interaktive Kartenansicht | ✅ | MapView mit Mapbox GL, Marker, Clustering |
| Listenansicht | ✅ | EventCard-Liste auf Startseite |
| Event-Detailseite | ✅ | `/events/[id]` mit Bildergalerie und Mini-Map |
| Suchfunktion (Text) | ✅ | SearchBar + GET /events?search= |
| Organizer Account-Erstellung | ✅ | Signup + E-Mail-Verifizierung |
| Event-Einreichung durch Organizer | ✅ | Create/Edit-Formular mit Flyer-Upload |
| Admin-Moderation | ✅ | Approve/Reject mit Kommentar-Modal |
| Filter: Kategorie | ✅ | FilterPanel, GET /events?category= |
| Filter: Distanz (km) | ✅ | Haversine-Formel im Backend |
| Filter: Textsuche | ✅ | GET /events?search= |
| Mobile-first Web-App | 🔧 | Tailwind CSS vorhanden, kein PWA-Manifest |

### Section 5 — Functional Requirements

#### Kernfunktionen

| Feature | Status | Details |
|---------|--------|---------|
| Karten- & Listenansicht | ✅ | |
| Event-Detailseite | ✅ | |
| Organizer Account + E-Mail-Verifizierung | ✅ | Token-basiert via Nodemailer |
| Organizer Event-Verwaltung | ✅ | Signup, Login, Dashboard, CRUD |
| Admin-Moderation | ✅ | Approve/Reject mit Kommentar |
| Admin-Benutzerverwaltung | ✅ | Liste, Bearbeiten, Soft-Delete, Rollenänderung |
| Unified Login | ✅ | Ein Endpunkt für Organizer + Admin |
| Rollenpromotion | ✅ | Organizer → Admin via Admin-Panel |
| Keyword-Suche | ✅ | |
| Standortbasierte Suche | 🔧 | Distanzfilter funktioniert; Geocoding fehlt |

### Section 6 — Non-Functional Requirements

| Anforderung | Status | Details |
|-------------|--------|---------|
| Mobile-first (PWA) | 🔧 | Responsive Design vorhanden, kein PWA-Manifest |
| High-performance Map/Search | 🔧 | Kein Caching, keine Pagination |
| Monitoring (Grafana) | ❌ | Nicht konfiguriert |
| Database Migrations | ✅ | 8 TypeORM-Migrationen |
| Caching (Redis) | ❌ | Container läuft, kein Code implementiert |

### Section 8 — Security & Compliance

| Anforderung | Status | Details |
|-------------|--------|---------|
| HTTPS everywhere | ❌ | Kein TLS in Docker-Setup |
| JWT-Auth | ✅ | Unified Login + Guards |
| Password-Hashing (bcrypt) | ✅ | bcryptjs, saltRounds=10 |
| Rollenbasierter Zugriff | ✅ | RolesGuard + @Roles()-Decorator |
| E-Mail-Verifizierung | ✅ | Token-basiert, blockiert Login bis verifiziert |
| Helmet.js (Security-Header) | ✅ | In main.ts aktiviert |
| Rate Limiting | ✅ | @nestjs/throttler auf Login-Endpunkten |
| CSRF-Schutz | ❌ | Nicht implementiert |
| GDPR (Export & Delete) | ❌ | Nicht implementiert |

---

## 3. Technische Schulden

### Sicherheitslücken

| Problem | Schwere | Details |
|---------|---------|---------|
| **Kein HTTPS** | Kritisch | Alle API-Aufrufe unverschlüsselt in Produktion |
| **localStorage für JWT** | Mittel | Besser: httpOnly Cookie (XSS-resistenter) |
| **CSRF-Schutz fehlt** | Mittel | State-changing Requests über Browser möglich |
| **Statische Bilder ungeschützt** | Niedrig | `/uploads`-Verzeichnis öffentlich, keine Auth |

### Fehlende Validierung

- Kein Check ob `latitude`/`longitude` im gültigen Bereich liegen
- `endDate > startDate` wird nicht validiert
- Keine maximale Länge für `description`

### Fehlende Error-Handling

- Groq-API-Fehler beim Flyer-Upload gibt 500er zurück (kein graceful fallback)

### Code-Qualität

- `images`-Spalte (JSON) in `events`-Tabelle neben `event_images` redundant (Legacy)
- Redis-Dependency ohne Implementierung (toter Code)
- JWT in localStorage statt httpOnly-Cookie

### Fehlende Tests

- Keine Integration-Tests
- Keine E2E-Tests für kritische Flows
- Testabdeckung unbekannt (kein Coverage-Report konfiguriert)

---

## 4. Roadmap bis Livegang

### 🔴 Blocker (muss vor Go-Live erledigt sein)

**Security**
- [ ] HTTPS einrichten (Reverse-Proxy nginx/Caddy oder Railway-Hosting)
- [ ] JWT in httpOnly-Cookie statt localStorage migrieren
- [ ] Validierung `endDate > startDate` in DTO
- [ ] Latitude/Longitude-Bereichsvalidierung

**Deployment**
- [ ] Production-Docker-Compose oder Railway-Config mit echten ENV-Variablen
- [ ] SMTP-Provider für Produktion konfigurieren (kein Mailhog)
- [ ] Datenbankmigrationen bei Start automatisch ausführen
- [ ] Admin-Seed-Account in Produktions-DB mit sicherem Passwort

---

### 🟡 Wichtig (sollte vor Go-Live erledigt sein)

**Performance**
- [ ] Pagination für `GET /events` (Cursor oder Offset/Limit)
- [ ] Redis-Caching für `GET /events` ohne Filter (TTL 60s)
- [ ] Datenbankindex auf `(status, startDate)` kombiniert prüfen

**UX & Vollständigkeit**
- [ ] PWA-Manifest + `manifest.json` (Name, Icons, theme_color)
- [ ] E-Mail an Organizer bei Approve/Reject (SMTP schon konfiguriert)
- [ ] Bestätigungsseite nach erfolgreichem Event-Submit
- [ ] Standortbasierte Suche per Ortsname (Geocoding)

**Code-Qualität**
- [ ] Legacy `images`-JSON-Spalte in `events` per Migration entfernen
- [ ] Redis-Caching-Code implementieren oder Dependency entfernen

---

### 🟢 Nice-to-have (kann nach Go-Live kommen)

**Features**
- [ ] GDPR: Datenexport & -löschung für Organizer
- [ ] Bilder in Cloud Storage (S3 / Cloudflare R2) statt lokaler Disk
- [ ] Bild-Optimierung (WebP, Thumbnails)
- [ ] CSRF-Schutz (Double-Submit-Cookie oder SameSite=Strict)
- [ ] Event-Statistiken im Admin-Dashboard (Views, Anmeldungen)

**Monitoring & Betrieb**
- [ ] Grafana + Prometheus (Backend-Metriken: Latenz, Fehlerrate)
- [ ] Health-Check-Endpunkt (`GET /health`)
- [ ] Automatische MySQL-Dumps

**Tests**
- [ ] Integration-Tests für kritische API-Flows
- [ ] E2E-Tests mit Playwright
- [ ] Jest-Coverage-Report (Ziel: ≥ 70 % für kritische Services)

**DX**
- [ ] GitHub Actions CI: Build + Test bei jedem PR
- [ ] API-Dokumentation mit Swagger/OpenAPI

---

## 5. Zusammenfassung

| Kategorie | Ergebnis |
|-----------|----------|
| PRD-Abdeckung (MVP-Kernfunktionen) | ~90 % umgesetzt |
| Kritische Sicherheitslücken | 1 (kein HTTPS) |
| Technische Schulden (hoch) | 2 (localStorage JWT, kein CSRF) |
| Deployment-Bereitschaft | Nicht produktionsreif ohne Blocker-Tasks |
| Empfohlene nächste Schritte | HTTPS + Pagination + SMTP-Produktion |

Die Codebasis deckt den MVP vollständig ab. E-Mail-Verifizierung, Admin-Benutzerverwaltung, Unified Login und Rollenmanagement sind implementiert. Vor einem Livegang sind primär HTTPS, ein Produktions-SMTP-Provider und Pagination notwendig.
