# Frontend Client - User Management System

A responsive React application built with Vite and Tailwind CSS.

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` root:

```env
# URL of the deployed Backend (No trailing slash)
VITE_PURPLEMERIT_BACKEND_URL=http://localhost:5000
```

## 📦 Features & UI

- **Modern Architecture**: Uses React Router 6.4+ Data APIs and Loaders.
- **Global State**: `AuthContext` handles user persistence and session checks.
- **Interceptors**: Axios interceptor automatically handles `401 Unauthorized` redirects.
- **Responsive**: Mobile-first design using Tailwind CSS utility classes.

## 🏃‍♂️ Scripts

- `npm run dev`: Start local development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build locally.

---
