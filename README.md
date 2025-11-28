# PRD — Regional Events Web & Mobile App

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

## 9. Operations & Scaling
- Database migrations
- Redis caching
- Grafana monitoring

## 10. Roadmap

### **Phase 1 (MVP)**
- Mobile-first web app
- Map/list views
- Event details
- Search & filters
- Organizer onboarding & submission
- Admin moderation
- Database migrations & caching

### **Phase 2**
- Mobile app
- Public event crawler
- Social features (friends, private events, groups)
- Notifications & advanced filters

### **Phase 3**
- AI-based recommendations
- Monetization (ads, ticketing)
- Advanced analytics
- Scaling improvements
