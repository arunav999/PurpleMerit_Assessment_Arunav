# Mini User Management System (RBAC)

A full-stack authentication and user management system built with the MERN stack. This application features secure JWT authentication, session management via Redis, and Role-Based Access Control (RBAC) for Administrators and Standard Users.

**Backend Developer Intern Assessment - Arunav Singh**

## 🚀 Live Deployment

- **Frontend (Vercel):** [INSERT_VERCEL_LINK_HERE]
- **Backend (Render):** [INSERT_RENDER_LINK_HERE]
- **API Documentation:** See Backend README

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router v6, Axios, React Toastify.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Primary Data), Redis (Session/Token Management).
- **Security:** Helmet, CORS, Bcrypt, JWT (HttpOnly Cookies), Express Rate Limit.
- **Deployment:** Vercel (Backend), Netlify (Frontend).

## 📂 Project Structure

This is a Monorepo containing two main directories:

- **/backend**: Express REST API server.
- **/frontend**: React client application.

## ⚡ Quick Start (Local Setup)

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas URI
- Redis Cloud URI (or local Redis)

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env file (see backend/README.md)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create .env file (see frontend/README.md)
npm run dev
```

## ✨ Key Features

- **Authentication**: Secure Login/Signup with Password Strength meters.
- **Session Management**: Redis-backed session storage with revocation support (Logout).
- **RBAC**:
  - **Admin**: View all users, pagination, activate/deactivate accounts.
  - **User**: View profile (Admin dashboard restricted).
- **Security**:
  - HttpOnly Cookies to prevent XSS.
  - Rate Limiting on Login endpoints.
  - Centralized Error Handling.

---