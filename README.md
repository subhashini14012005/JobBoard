# 💼 CareerPulse — Full-Stack MERN Job Board Application

CareerPulse is a production-grade, full-stack **MERN** (MongoDB, Express.js, React, Node.js) Job Board platform featuring role-based authorization (**Job Seekers** & **Employers**), dynamic search & filtering, real-time application status tracking, and modern glassmorphic aesthetics.

---

## 🌟 Key Features

### 👤 Role-Based Authentication & Permissions
- **Job Seekers**: Browse job listings, filter by category/location/type, submit cover letters & resumes, track application review statuses in real time.
- **Employers**: Post new job listings, edit or delete postings, inspect incoming candidate applications, update candidate status (`Submitted` ➔ `Under Review` ➔ `Interview` ➔ `Accepted` / `Rejected`).
- **JWT Authentication**: Password hashing with `bcryptjs`, state persistence, and protected routes.

### 🔍 Search & Multi-Filter Engine
- Instant search across job titles, company names, and descriptions.
- Filter by category (*Engineering*, *Design*, *Product*, *Marketing*, *Sales*, *Customer Support*, *Other*).
- Filter by job types (*Full-time*, *Part-time*, *Remote*, *Contract*, *Internship*).

### 🎨 Modern Aesthetic Design System
- Dark mode theme with glassmorphism UI card components.
- Responsive mobile-first grid layout.
- Smooth transitions, custom status pill badges, and quick-fill demo buttons for seamless reviewer testing.

---

## 🏗 System Architecture

```
+-------------------------------------------------------------+
|                      React Frontend                         |
|  Vite + React Router + Axios + Glassmorphic CSS + AuthContext|
+------------------------------+------------------------------+
                               |
                        HTTP / REST APIs
                               |
+------------------------------v------------------------------+
|                     Node.js / Express API                   |
|   authRoutes  |  jobRoutes  |  applicationRoutes           |
|   authMiddleware (JWT)     |  roleMiddleware (Roles)        |
+------------------------------+------------------------------+
                               |
                          Mongoose ODM
                               |
+------------------------------v------------------------------+
|                        MongoDB Database                     |
|           Users   |   Jobs   |   Applications               |
+-------------------------------------------------------------+
```

---

## 📂 Project Directory Structure

```
job-board/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobFilter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── JobDetailsPage.jsx
│   │   │   ├── PostJobPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express + Mongoose Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **npm** or **yarn**
- **MongoDB**: Local MongoDB server or MongoDB Atlas URI (falls back to in-memory mode if DB is offline).

---

### 1️⃣ Setting Up the Backend Server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-board
JWT_SECRET=super_secret_jwt_key_2026
NODE_ENV=development
```

To seed initial sample data (Seeker & Employer demo accounts, job postings, and applications):

```bash
npm run seed
```

Start the Express development server:

```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 2️⃣ Setting Up the Frontend Client

In a new terminal window:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
# Client running at http://localhost:3000
```

---

## 🧪 Demo Accounts for Instant Review

When testing on the login page (`/login`), click the **Quick Demo Login** buttons:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `seeker@demo.com` | `password123` | Browse jobs, submit application, view status dashboard |
| **Employer** | `employer@demo.com` | `password123` | Post jobs, review candidates, update applicant status |

---

## 📡 API Reference Endpoint Table

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`seeker` or `employer`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current user session profile |

### Job Listings (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Get all active jobs (supports `search`, `category`, `jobType`) |
| `GET` | `/api/jobs/:id` | Public | Get detailed specifications for a single job |
| `POST` | `/api/jobs` | Employer | Post a new job listing |
| `PUT` | `/api/jobs/:id` | Employer (Owner) | Update an existing job listing |
| `DELETE` | `/api/jobs/:id` | Employer (Owner) | Remove a job listing |
| `GET` | `/api/jobs/employer/mine` | Employer | Fetch jobs posted by current employer |

### Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications` | Seeker | Submit application to a job listing |
| `GET` | `/api/applications/mine` | Seeker | Get applications submitted by seeker |
| `GET` | `/api/applications/job/:jobId` | Employer | Get candidate applications for job posting |
| `PATCH` | `/api/applications/:id/status` | Employer | Update candidate application status |

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push project to GitHub repository.
2. Import project into Vercel dashboard.
3. Set **Root Directory** to `client`.
4. Configure environment variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`.
5. Deploy!

### Backend Deployment (Render / Railway)
1. Connect repository to Render Web Service.
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `npm start`.
5. Environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.

---

## 🛡 License
Distributed under the MIT License.
