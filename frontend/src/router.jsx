import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "./components/layouts/AppLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Auth/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
    ],
  },
]);

export default router;
