# Campus Recruitment Portal

A full-stack web application that streamlines campus placements by connecting students with opportunities managed by the Training & Placement (TNP) office.

---

## 🚨 Problem Statement

In many colleges, placement-related information is scattered across emails, WhatsApp groups, and notice boards. This leads to missed opportunities, lack of transparency, and inefficient manual tracking.

This project solves these issues by providing a centralized platform for managing the entire recruitment process.

---

## 🎯 Objectives

- Centralize recruitment data and opportunities  
- Automate application and eligibility tracking  
- Improve transparency for students and TNP  

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)

---

## Overview

The Campus Recruitment Portal is a role-based platform with two types of users:

- **Students** – Register, complete their profile, browse opportunities, apply, and track their application status.
- **TNP Admin** – Manage opportunities, review applications, shortlist/select students, post announcements, and view all student profiles.

---

##  Features

### Student
- Register & login with email/password
- Complete profile (Roll No., Branch, Year, CGPA, Skills, Projects)
- Upload resume during profile setup
- Browse available placement/internship opportunities
- Apply to eligible opportunities
- Track application status (Applied → Shortlisted → Selected / Rejected)
- View announcements from the TNP office
- View selection results
- Change password via Settings

### TNP Admin
- Secure admin login
- Post new opportunities with eligibility criteria (branch, year, CGPA)
- View and manage all student applications
- Update application status (shortlist, select, reject)
- Post announcements to all students
- View complete student list with profiles
- Change password via Settings

---

##  Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4   |
| Routing    | React Router DOM v7               |
| Icons      | Lucide React                      |
| HTTP       | Axios                             |
| Backend    | Node.js, Express v5               |
| Database   | MySQL (hosted on Railway)         |
| File Upload| Multer                            |
| Email      | Nodemailer                        |
| Dev Tools  | Nodemon, ESLint                   |

---

##  Project Structure

```
Campus-Recruitment-Portal/
├── backend/
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MySQL connection (Railway)
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, change password
│   │   │   ├── studentController.js    # Student profile, documents
│   │   │   ├── opportunityController.js# CRUD for opportunities
│   │   │   ├── applicationController.js# Apply, status updates
│   │   │   └── tnpController.js        # Admin actions, announcements
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # Route protection
│   │   │   └── upload.js           # Multer config for resume uploads
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   ├── opportunityRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   └── tnpRoutes.js
│   │   └── utils/
│   │       └── emailService.js     # Nodemailer email notifications
│   └── uploads/
│       └── resumes/                # Uploaded student resumes
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                 # Routes & ProtectedRoute logic
        ├── main.jsx
        ├── services/
        │   └── api.js              # Axios base configuration
        ├── components/
        │   ├── dashboard/
        │   │   ├── ApplicationTable.jsx
        │   │   ├── OpportunityCard.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── StatCard.jsx
        │   └── layout/
        │       └── DashboardLayout.jsx
        └── pages/
            ├── auth/
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   └── CompleteProfile.jsx
            ├── student/
            │   ├── Dashboard.jsx
            │   ├── Opportunities.jsx
            │   ├── Applications.jsx
            │   ├── Profile.jsx
            │   ├── Announcements.jsx
            │   └── Selected.jsx
            ├── tnp/
            │   ├── Dashboard.jsx
            │   ├── Applications.jsx
            │   ├── AddOpportunity.jsx
            │   ├── Announcements.jsx
            │   └── StudentsList.jsx
            └── common/
                └── Settings.jsx
```

---

##  Database Schema

The following tables are auto-created on server start:

| Table                    | Description                                          |
|--------------------------|------------------------------------------------------|
| `users`                  | All users (students & admins) with role              |
| `students`               | Student academic profile linked to `users`           |
| `opportunities`          | Job/internship/hackathon listings                    |
| `opportunity_eligibility`| Branch, year, CGPA criteria per opportunity          |
| `documents`              | Uploaded resumes/certificates per student            |
| `applications`           | Student–opportunity application with status          |
| `announcements`          | TNP broadcast messages                               |
| `selections`             | Final selected student records                       |

---

##  API Endpoints

### Auth — `/api/auth`
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/register`          | Register a new student   |
| POST   | `/complete-profile`  | Submit academic profile  |
| POST   | `/login`             | Login (student or admin) |
| POST   | `/change-password`   | Change account password  |

### Student — `/api/student`
| Method | Endpoint       | Description                   |
|--------|----------------|-------------------------------|
| GET    | `/profile/:id` | Get student profile by user ID|
| PUT    | `/profile`     | Update student profile        |

### Opportunities — `/api/opportunities`
| Method | Endpoint    | Description                      |
|--------|-------------|----------------------------------|
| GET    | `/`         | List all opportunities           |
| POST   | `/`         | Create new opportunity (admin)   |
| DELETE | `/:id`      | Delete opportunity (admin)       |

### Applications — `/api/applications`
| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| POST   | `/`               | Apply to an opportunity            |
| GET    | `/student/:rollNo`| Get all applications of a student  |
| PUT    | `/status`         | Update application status (admin)  |

### TNP Admin — `/api/tnp`
| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| GET    | `/students`       | List all students              |
| GET    | `/applications`   | View all applications          |
| POST   | `/announcements`  | Post an announcement           |
| GET    | `/announcements`  | Get all announcements          |

---

##  Getting Started

### Prerequisites

- Node.js v18+
- MySQL database (local or Railway)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Ruchika2005/Campus-Recruitment-Portal.git
```
```bash
cd campus-recruitment-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#environment-variables)).

```bash
npm run dev       # Development with nodemon
# or
npm start         # Production
```

The server starts on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

---

##  Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL=mysql://username:password@host:port/database_name
```

> The project uses [Railway](https://railway.app/) for hosted MySQL. You can also use a local MySQL instance by setting the connection string accordingly.

---

##  Default Credentials

A default admin account is automatically created on first server start:

| Field    | Value               |
|----------|---------------------|
| Email    | `admin@college.com` |
| Password | `admin123`          |
| Role     | TNP Admin           |

>  **Change this password immediately after first login in a production environment.**

---

## Screenshots

### Login Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/83d950c9-d2b1-482a-96a7-a75033a44813" />

### Student Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/adc06b2e-111d-4fbe-a9f1-977337807edb" />

### Opportunities page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/448505ea-189f-437c-a1e8-d5dc82c8db98" />

### Applications Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4f82f986-a94b-40cc-9105-8de885845d9a" />

### Admin Panel
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a0c0456b-a3ef-41f8-8c95-13aaa8213dd2" />

### Add Opportunity (Admin)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/04b47153-19a1-41dc-99e5-652320cc5c93" />

### Student List (Admin)
<img width="1893" height="708" alt="image" src="https://github.com/user-attachments/assets/be32ff61-2e74-4ea3-9e86-518ee007d1b1" />

### Announcements (Admin)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/601c5d10-3e15-4f1c-8069-2dcda7bf01d5" />

---

##  Notes

- Passwords are currently stored as **plain text**. For production use, implement hashing with `bcrypt`.
- JWT-based authentication is stubbed but not yet enforced on all routes. The `authMiddleware.js` file can be extended for token validation.
- File uploads are stored locally under `backend/uploads/resumes/`. For production, consider cloud storage (e.g., AWS S3).
- The `createTables()` function in `server.js` is commented out by default; uncomment it once on a fresh database to initialize all tables.

---
