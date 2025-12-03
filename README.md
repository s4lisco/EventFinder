# PRD — Regional Events Web & Mobile App

## Install & Run project
- Download the Git Repo
- Run the following commands
```
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d
```
- Insert test data by running the following command in a new terminal
```
docker exec -i postgres psql -U postgres -d eventfinder < temp/seed-test-data.sql
```

## 1. Overview

### **Purpose**
A web and mobile application displaying public regional events. Allows:
- Consumers to quickly discover nearby events.
- Organizers to easily promote their events on a unified platform.

### **Target Users**
- **Consumers:** People looking for nearby events/activities.
- **Organizers:** Event creators seeking centralized visibility.

## 2. Problem Statement

### **Consumer Pain Points**
- Event data scattered across platforms.
- Hard to find local, current events.
- Lack of unified map or list view.

### **Organizer Pain Points**
- Need to manually post across platforms.
- Low localized visibility.
- No unified calendar or map.
- Hard to update event info.
- No analytics or engagement insights.

### **Solution**
A single platform where:
- Organizers upload/manage events.
- Users browse via map, list, and search features.

## 3. Goals & Non-Goals

### **Primary Goals (MVP)**
- Interactive map & list views.
- Event detail page.
- Search functionality.
- Organizer account creation & event submission.
- Admin moderation/approval.
- Event filters (category, distance, text).
- Mobile-first web app.

### **Non-Goals (Future Phases)**
- Consumer accounts, social features.
- Chat or messaging.
- AI recommendations.
- Ticketing/payments.
- Monetization/ad support.
- Advanced analytics.

## 4. User Stories

### **Consumer**
1. View events near current location.
2. Explore events on map.
3. See list view.
4. Access event details.
5. Filter by category, distance, keywords.
6. Search via keyword/location.

### **Organizer**
1. Create account.
2. Submit events (title, description, date range, category, price, location, media).
3. Edit/delete events.
4. Have events visible on map/search.
5. Get approval confirmation.
6. Check event status (pending/approved/rejected).

## 5. Functional Requirements

### **Event Data**
- **Required:** Title, description, start/end date, category, price info, location name/address, GPS coordinates, organizer name.
- **Optional:** Website/link, images.

### **Filters**
- Category
- Distance
- Text search

### **Functional Features**
- Map & list views
- Event details page
- Organizer account + event management
- Admin moderation
- Keyword & location-based search

## 6. Non-Functional Requirements
- Mobile-first (PWA initially)
- High-performance map/search
- Monitoring (Grafana)
- Database migrations
- Caching (Redis)

## 7. System Architecture & Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | Next.js, React, Tailwind CSS, Mapbox |
| **Backend** | Node.js, NestJS, REST API |
| **Database** | PostgreSQL + PostGIS |
| **Caching** | Redis |
| **Deployment** | Docker |
| **Monitoring** | Grafana |
| **Phase 2 Crawler** | Pipeline: crawler → queue → parser → DB |

## 8. Security & Compliance
- HTTPS everywhere
- JWT auth (organizers)
- Password hashing (bcrypt/argon2)
- Role-based access (organizer/admin/user)
- XSS / CSRF protection
- GDPR compliance (export & delete organizer data)
- Optional API rate limiting

## 8.1 Environment Variables

### Backend (`.env`)
```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=events

# JWT
JWT_SECRET=your-jwt-secret

# Event Flyer Upload Feature (Optional)
# Google Cloud Vision API for OCR
# Can be: JSON string, file path to credentials.json, or base64-encoded JSON
GOOGLE_CLOUD_VISION_CREDENTIALS=path/to/credentials.json

# Groq API for LLM extraction (Llama 3 70b)
GROQ_API_KEY=your-groq-api-key
```

### Frontend (`.env.local`)
```bash
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

# EventFinder – Web & Mobile (Capacitor)

Dieses Projekt ist nun als Webapp (Next.js) und als iOS/Android App via Capacitor lauffähig.

## Voraussetzungen
- Node.js LTS (empfohlen: 20.x oder 18.x). Node 24 verursacht Build-Fehler mit Next 14.
- npm
- macOS für iOS-Builds: Xcode installiert, CocoaPods (`sudo gem install cocoapods`).
- Android: Android Studio/SDK, Emulator eingerichtet.

## Frontend-Setup
```bash
cd frontend
npm install
```

## Entwicklung (Web)
```bash
cd frontend
npm run dev
```
App läuft unter http://localhost:3000.

## Entwicklung (Mobile mit Live-Reload)
Starte zuerst den Next.js Dev-Server:
```bash
cd frontend
npm run dev
```

Dann in einem zweiten Terminal:
```bash
# iOS (öffnet Simulator/Xcode)
npm run run:ios

# Android (öffnet Emulator/Android Studio)
npm run run:android
```
Hinweis: Für iOS müssen Xcode und CocoaPods installiert sein. Für Android ein laufender Emulator.

## Build & Sync der nativen Projekte
```bash
cd frontend
npm run build:web
npm run sync
```
Danach kannst du die Projekte öffnen:
```bash
npm run ios      # Öffnet iOS-Projekt in Xcode
npm run android  # Öffnet Android-Projekt in Android Studio
```

## Geolocation
- Nativ (Capacitor): nutzt `@capacitor/geolocation` und fragt Berechtigungen an.
- Web: fällt auf `navigator.geolocation` zurück.
- Der Code prüft SSR (kein Zugriff auf `window`/`navigator` während Server-Rendern).

## Wichtige Umgebungsvariablen
- `NEXT_PUBLIC_API_URL`: Basis-URL des Backends für das Frontend. Stelle sicher, dass diese für Web und Mobile erreichbar ist.
- Capacitor Dev-Server-URL: `frontend/capacitor.config.ts` nutzt standardmäßig `http://localhost:3000` für Livereload.

## CORS
Wenn du den NestJS-Backend-Server mit der App nutzt, stelle sicher, dass CORS Ursprünge wie `http://localhost:3000`, `capacitor://localhost` und ggf. `ionic://localhost` erlaubt sind.

## Häufige Fehler
- `Cannot find module '../server/require-hook'` oder fehlende `next`/`tsc`-Bins: Nutze Node LTS (18/20) und führe Befehle im Ordner `frontend/` aus. Danach `npm install` und erneut bauen.
- iOS `pod install` Fehlermeldungen: Installiere CocoaPods (`sudo gem install cocoapods`) und führe `pod install` in `frontend/ios/App` aus.
- Android HTTP in Dev: Für Livereload ist `android:usesCleartextTraffic="true"` gesetzt; für Produktion auf HTTPS umstellen.

## Docker
Docker-Setup für das Backend bleibt unverändert. Mobile Apps laufen außerhalb von Docker, greifen aber auf die im Container bereitgestellten Backend-Ports zu (achte auf korrekte `NEXT_PUBLIC_API_URL`).

# EventFinder — Capacitor Dev Hinweise

Wenn du die App im iOS/Android Simulator mit Live-Reload startest, muss die native WebView auf deinen Next.js Dev-Server zugreifen können.

Wichtig:
- Setze in `frontend/capacitor.config.ts` die `server.url` NICHT auf `localhost`, sondern auf deine LAN-IP.
  - Beispiel: `http://192.168.1.50:3000` (dein Rechner im gleichen Netzwerk)
  - Android Emulator: `http://10.0.2.2:3000`
- `cleartext: true` erlaubt HTTP im Dev. Für Produktion entferne `server.url` und baue statische Assets (`npm run build && npx cap sync`).
- iOS: Falls ATS (App Transport Security) blockiert, setze temporär Ausnahmen in `Info.plist` (nur Dev).

Ablauf Dev (Beispiel):
1. Frontend Dev starten:
   - `cd frontend`
   - `npm run dev`
2. In `frontend/capacitor.config.ts` die `server.url` korrekt setzen (LAN-IP oder Emulator-Spezialadresse).
3. Synchronisieren:
   - `npx cap sync`
4. Öffnen:
   - `npx cap open ios` oder `npx cap open android`

Fehler "Verbindung zum Server konnte nicht hergestellt werden":
- Ursache: iOS WebView versucht `localhost:3000`, das ist in der WebView nicht dein Rechner.
- Lösung: LAN-IP nutzen oder Emulator-Adresse (siehe oben).
