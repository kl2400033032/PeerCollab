# PeerCollab

PeerCollab is a final-year-ready peer review and collaboration platform for students and teachers. It combines secure cookie-based JWT authentication, CSRF protection, project submission, peer reviews, realtime comments, notifications, analytics, file uploads, activity tracking, and role-based dashboards in a production-style React + Spring Boot + MySQL architecture.

## Project Overview

PeerCollab supports two roles:

- `ADMIN`: creates assignments, monitors projects, views analytics, and oversees engagement
- `STUDENT`: creates projects, reviews peer work, comments in realtime, uploads files, and tracks notifications

The application is designed to be:

- demo-ready for viva and evaluation
- submission-ready with test data and documentation
- deployment-ready with environment-based configuration

## Features

### Core

- JWT authentication with `HttpOnly` cookies, CSRF protection, and role-based authorization
- project CRUD with search, filters, pagination, and status tracking
- peer reviews with structured feedback and rating
- comments and collaboration threads on each project
- admin and student dashboards

### Advanced

- realtime comments using WebSocket + STOMP
- notifications stored in the database
- activity logs for important user actions
- project file upload and download for PDF/ZIP files
- admin analytics with chart-ready datasets
- dark mode, skeleton loaders, and polished SaaS-like UI
- environment-based production configuration

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, Recharts, STOMP
- Backend: Spring Boot 3, Spring Security, JWT, Spring Data JPA, Spring WebSocket, Spring Cache, Spring Mail
- Database: MySQL 8
- Java: 17
- Testing: JUnit 5, Spring Boot Test, MockMvc, H2

## Architecture

### Frontend

[src](/C:/PeerCollab/src)

- `components`: reusable forms, shared UI, cards, loaders, and notification widgets
- `contexts`: authentication state
- `layouts`: app shell and navigation
- `pages`: dashboard, projects, auth pages, and detail views
- `services`: API wrappers and realtime connection helpers
- `utils`: storage and validation helpers

### Backend

[backend](/C:/PeerCollab/backend)

- `config`: security, cache, and websocket configuration
- `controller`: REST endpoints
- `dto`: request and response contracts
- `entity`: JPA domain entities
- `exception`: global exception handling
- `repository`: data access layer
- `security`: JWT filter and token service
- `service`: business logic, analytics, notifications, email, uploads, and activity tracking

Request flow:

`Controller -> Service -> Repository -> MySQL`

Realtime flow:

`CommentService -> SimpMessagingTemplate -> STOMP Topic -> React subscriber`

Security flow:

`React -> CSRF bootstrap -> login/register -> HttpOnly JWT cookie -> Spring Security filter chain -> controller/service`

## Database Schema

Main schema file:

- [schema.sql](/C:/PeerCollab/backend/schema.sql)

Seed data file:

- [data.sql](/C:/PeerCollab/backend/src/main/resources/data.sql)

Main tables:

- `users`
- `assignments`
- `projects`
- `reviews`
- `comments`
- `notifications`
- `activity_logs`

Relationships:

- one user -> many projects
- one user -> many activity logs
- one project -> many reviews
- one project -> many comments
- one user -> many notifications
- one assignment -> one linked project submission

Key DB design points:

- foreign keys added for all major relationships
- indexes added for project search/filter fields and analytics-heavy joins
- cascade deletion on child tables where appropriate
- unique review constraint per reviewer per project
- secure enum-based role and status constraints

## API List

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/csrf`
- `GET /api/auth/me`
- `DELETE /api/auth/logout`

### Users

- `GET /api/users/students`

### Projects

- `GET /api/projects`
- `GET /api/projects/mine`
- `GET /api/projects/{id}`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `POST /api/projects/{id}/attachment`
- `GET /api/projects/{id}/attachment/download`
- `POST /api/projects/{id}/reviews`
- `POST /api/projects/{id}/comments`

### Assignments

- `GET /api/assignments`
- `GET /api/assignments/my`
- `POST /api/assignments`

### Dashboard

- `GET /api/dashboard/admin`
- `GET /api/dashboard/student`

### Notifications

- `GET /api/notifications`
- `GET /api/notifications/summary`
- `PATCH /api/notifications/{id}/read`

### Activity

- `GET /api/activity`

### Analytics

- `GET /api/analytics/admin`

### Realtime

- `WS /ws`
- Topic: `/topic/projects/{projectId}/comments`
- Topic: `/topic/users/{userId}/notifications`

## Setup Steps

### 1. Prerequisites

- Node.js 18+
- MySQL 8+
- Maven 3.9+
- Java 17 JDK

### 2. Create Database

```sql
CREATE DATABASE IF NOT EXISTS peercollabdb;
```

Optional manual schema import:

```sql
SOURCE C:/PeerCollab/backend/schema.sql;
```

### 3. Configure Java 17

PowerShell example:

```powershell
$env:JAVA_HOME='C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot'
$env:Path='C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin;' + $env:Path
java -version
```

### 4. Start Backend

From [backend](/C:/PeerCollab/backend):

```bash
mvn clean install
mvn spring-boot:run
```

### 5. Start Frontend

From [C:\PeerCollab](/C:/PeerCollab):

```bash
npm install
npm run dev
```

### 6. Frontend Environment

Use [.env.example](/C:/PeerCollab/.env.example):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Production Configuration

Backend environment variables supported in [application.properties](/C:/PeerCollab/backend/src/main/resources/application.properties):

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SPRING_PROFILES_ACTIVE`
- `SERVER_PORT`
- `APP_CORS_ALLOWED_ORIGINS`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION`
- `APP_AUTH_COOKIE_NAME`
- `APP_AUTH_COOKIE_SECURE`
- `APP_AUTH_COOKIE_SAME_SITE`
- `APP_AUTH_COOKIE_DOMAIN`
- `APP_UPLOAD_DIR`
- `APP_UPLOAD_MAX_FILE_SIZE`
- `APP_UPLOAD_MAX_REQUEST_SIZE`
- `APP_EMAIL_ENABLED`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_SMTP_AUTH`
- `MAIL_SMTP_STARTTLS`
- `JPA_SHOW_SQL`
- `JPA_FORMAT_SQL`
- `SPRING_SQL_INIT_MODE`

Profile behavior:

- `dev`: schema auto-update, seed data loading, localhost-safe cookie defaults
- `prod`: schema validation only, no seed data loading, secure cookie defaults

## Deployment Steps

### Backend on Render or Railway

1. Provision MySQL.
2. Set `SPRING_PROFILES_ACTIVE=prod`.
3. Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `APP_JWT_SECRET`, and `APP_CORS_ALLOWED_ORIGINS`.
4. Set cookie values for the live frontend:

```env
APP_AUTH_COOKIE_SECURE=true
APP_AUTH_COOKIE_SAME_SITE=None
APP_AUTH_COOKIE_DOMAIN=your-domain.com
```

5. For email, set `APP_EMAIL_ENABLED=true` and the SMTP values.
6. For uploads, mount persistent storage and set `APP_UPLOAD_DIR`.
7. Build:

```bash
mvn clean install
```

8. Run:

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Optional container image:

- [Dockerfile](/C:/PeerCollab/backend/Dockerfile)

### Frontend on Vercel or Netlify

1. Set:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

2. Make sure the deployed frontend URL is included in `APP_CORS_ALLOWED_ORIGINS`.
3. Build:

```bash
npm run build
```

4. Publish `dist`.

## Test Credentials

Seeded through [data.sql](/C:/PeerCollab/backend/src/main/resources/data.sql):

### Admin

- Email: `admin@peercollab.com`
- Password: `Admin@123`

### Student 1

- Email: `student1@peercollab.com`
- Password: `Student@123`

### Student 2

- Email: `student2@peercollab.com`
- Password: `Student@123`

## Demo Guide

### Admin Demo Flow

1. Login as `admin@peercollab.com`
2. Open the dashboard
3. Show:
   - total users and project analytics
   - review completion rate charts
   - recent activity feed
   - assignment monitoring
4. Navigate to Projects and monitor submissions

### Student Demo Flow

1. Login as `student1@peercollab.com`
2. Open Dashboard and show assignments, projects, and activity
3. Go to Projects and create a new project
4. Upload a PDF or ZIP file
5. Open the project details page
6. Show realtime comments and download attachment
7. Logout and login as `student2@peercollab.com`
8. Review Student 1's project
9. Add a comment
10. Return to `student1@peercollab.com`
11. Show notification badge, notification list, and updated project details

## API Testing with curl

### Login

The app uses a CSRF cookie and an `HttpOnly` auth cookie. First request a CSRF token and store cookies:

```bash
curl -c cookies.txt http://localhost:8080/api/auth/csrf
```

Then log in:

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -b cookies.txt -c cookies.txt ^
  -H "Content-Type: application/json" ^
  -H "X-XSRF-TOKEN: YOUR_CSRF_TOKEN" ^
  -d "{\"email\":\"admin@peercollab.com\",\"password\":\"Admin@123\"}"
```

### Create Project

```bash
curl -X POST http://localhost:8080/api/projects ^
  -b cookies.txt ^
  -H "Content-Type: application/json" ^
  -H "X-XSRF-TOKEN: YOUR_CSRF_TOKEN" ^
  -d "{\"title\":\"Final Demo Project\",\"description\":\"Submission for viva demo.\",\"status\":\"SUBMITTED\",\"assignmentId\":null}"
```

### Add Review

```bash
curl -X POST http://localhost:8080/api/projects/1/reviews ^
  -b cookies.txt ^
  -H "Content-Type: application/json" ^
  -H "X-XSRF-TOKEN: YOUR_CSRF_TOKEN" ^
  -d "{\"feedback\":\"Clear structure and polished implementation.\",\"rating\":5}"
```

### Add Comment

```bash
curl -X POST http://localhost:8080/api/projects/1/comments ^
  -b cookies.txt ^
  -H "Content-Type: application/json" ^
  -H "X-XSRF-TOKEN: YOUR_CSRF_TOKEN" ^
  -d "{\"message\":\"Let us refine the final screenshots before submission.\"}"
```

### Fetch Dashboard

```bash
curl -X GET http://localhost:8080/api/dashboard/admin ^
  -b cookies.txt
```

## Security Notes

- JWT expiration is enabled and configurable
- the browser never stores the auth token in `localStorage` or `sessionStorage`
- authentication uses a secure `HttpOnly` cookie
- CSRF protection is enabled for all state-changing requests
- role rules are enforced in Spring Security
- backend validation protects request payloads
- file uploads are limited to PDF/ZIP and 10 MB max
- uploaded filenames are sanitized and stored with generated names
- file download paths are normalized before access

## Testing

Added automated backend tests:

- [JwtServiceTest.java](/C:/PeerCollab/backend/src/test/java/com/peercollab/backend/security/JwtServiceTest.java)
- [PeerCollabApiIntegrationTest.java](/C:/PeerCollab/backend/src/test/java/com/peercollab/backend/PeerCollabApiIntegrationTest.java)

Run tests:

```bash
mvn test
```

## Final Verification

Verified locally:

- `mvn test`
- login flow with cookie auth
- secured APIs
- notifications
- analytics
- file upload
- realtime-ready backend startup
