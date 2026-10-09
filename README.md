# Civic Connect – Crowdsourced Civic Issue Reporting & Resolution System

A responsive web application and hackathon prototype for crowdsourcing, reporting, and tracking the resolution of civic issues (potholes, garbage accumulation, drainage overflow, non-functional streetlights, and sanitation hazards).

---

## 🚀 Key Features

1. **Home Page**:
   - Branding & Tagline: *"Report. Resolve. Build Better Cities."*
   - Interactive 4-step civic resolution lifecycle walkthrough.
   - Core feature pillars (Photo-based reporting, GPS location, Smart routing, Transparent tracking).
   - Live city pulse stats & recent public grievances showcase.

2. **Report Issue Page**:
   - Issue category dropdown (Pothole, Garbage, Drainage, Streetlight, Sanitation, Other).
   - Instant camera snap & file upload with real-time preview and sample test photos.
   - Browser Geolocation API integration to capture real device GPS coordinates (Latitude & Longitude) with ±4m accuracy and interactive visual radar map.
   - Smart duplicate complaint indication based on proximity (< 200m).
   - Automatic priority assessment & municipal department routing preview.
   - Complaint ID generation (e.g., `CC1024`, `CC1029`) with instant copyable ticket and quick-track link.

3. **Track Complaint Page**:
   - Search by complaint ID with quick demo chips (`CC1024`, `CC1025`, `CC1026`, etc.).
   - Visual 4-stage resolution pipeline:
     ```
     Submitted ➔ Assigned ➔ In Progress ➔ Resolved
     ```
   - Chronological audit trail showing timestamps, dispatch updates, and duty officer notes.
   - Full photo evidence and GPS coordinate pinpointing.

4. **Authority Dashboard**:
   - Municipal control console for ward dispatchers.
   - Live KPI overview (Total, Submitted, Assigned, In Progress, Resolved).
   - Filter and search by status, department, priority, and keyword.
   - Dual view modes: Interactive Cards and Table view.
   - Status update modal: update status along the resolution pipeline, assign duty officers, and log field remarks.
   - Seamless two-way synchronization: any status update by the authority immediately reflects on the citizen tracking page!

5. **REST API Backend**:
   - Full-stack Node.js + Express.js backend.
   - Persistent storage in `/data/complaints.json`.
   - Haversine distance calculations for duplicate detection.
   - Ready with sample complaints pre-loaded for demonstration.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (version 18 or later)
- npm

### Installation & Run

1. **Clone or navigate to the project directory**:
   ```bash
   cd civic-connect
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/complaints` | Retrieve all complaints (supports `?status=`, `?issueType=`, `?priority=`, `?search=`) |
| `GET` | `/api/complaints/:id` | Fetch specific complaint by ID (e.g. `CC1024`) |
| `POST` | `/api/complaints` | Create a new complaint with GPS coordinates and photo |
| `PATCH` | `/api/complaints/:id/status` | Update resolution status (`Submitted`, `Assigned`, `In Progress`, `Resolved`) |
| `GET` | `/api/complaints/check-nearby` | Check for nearby duplicate reports given latitude, longitude, and issue type |
| `GET` | `/api/stats` | Aggregated civic metrics for dashboard |
| `POST` | `/api/reset-demo` | Restore initial sample demo dataset |

---

## 📂 Project Organization

```
├── /data/                  # Persistent complaints JSON storage
├── /server/
│   ├── routes.ts           # Express REST API endpoints
│   └── storage.ts          # Storage engine, Haversine duplicate detector, routing logic
├── /src/
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive header with mobile drawer
│   │   ├── HomePage.tsx           # Landing page with civic pulse & features
│   │   ├── ReportIssuePage.tsx    # Complaint registration form & Geolocation
│   │   ├── TrackComplaintPage.tsx # Citizen tracking view & visual pipeline
│   │   ├── AuthorityDashboard.tsx # Civic authority dispatch console & status updater
│   │   ├── StatusTimeline.tsx     # 4-stage visual timeline component
│   │   ├── MapPreview.tsx         # GPS coordinates & radar map preview
│   │   └── LocalSetupModal.tsx    # In-app local setup guide modal
│   ├── constants/
│   │   └── civic.ts               # Department maps, SLA timings & presets
│   ├── services/
│   │   └── api.ts                 # Frontend API client
│   ├── types/
│   │   └── complaint.ts           # Shared TypeScript interfaces
│   ├── App.tsx                    # Main root component
│   ├── index.css                  # Tailwind styles
│   └── main.tsx                   # React client entry point
├── server.ts               # Express server mounting APIs and Vite middleware
├── package.json
└── tsconfig.json
```
