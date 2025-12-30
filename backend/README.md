# Backend API - User Management System

The REST API service handling authentication, user lifecycle, and administrative controls.

## ⚙️ Environment Variables

Create a `.env` file in the `backend` root with the following keys:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/purple_merit_db
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://<user>:<password>@redis-cloud-url:port
```

## 🚀 API Endpoints

**Authentication** (`/api/v1/auth`)

| Method | Endpoint  | Description                                    | Auth Required |
| ------ | --------- | ---------------------------------------------- | ------------- |
| POST   | /register | Register a new user (First user becomes Admin) | No            |
| POST   | /login    | Authenticate user & set HttpOnly cookie        | No            |
| POST   | /logout   | Revoke session (Redis) & clear cookie          | Yes           |


**User Management** (`/api/v1/users`)

Method | Endpoint      | Description                               | Auth Required
------ | ------------- | ----------------------------------------- | -------------
GET    | /me           | Get current logged-in user profile        | Yes
GET    | /             | Get all users (Pagination supported)      | Admin Only
PATCH  | /:id/status   | Activate/Deactivate a user account        | Admin Only
