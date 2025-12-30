// ==================== API BASE URL ====================
export const BASE_URL = import.meta.env.VITE_PURPLEMERIT_BACKEND_URL;

// ==================== API PATH CONSTANTS ====================
// Common API prefix for all endpoints
const API_COMMON = "/api/v1";

// Specific endpoint roots for each resource
const API_AUTH = `${API_COMMON}/auth`;
const API_USERS = `${API_COMMON}/users`;

// ==================== API PATHS OBJECT ====================
// Centralized object for all API endpoint paths
export const API_PATHS = {
  AUTH: {
    REGISTER: `${API_AUTH}/register`,
    // CHECK_EMAIL: `${API_AUTH}/check-email`,
    LOGIN: `${API_AUTH}/login`,
    LOGOUT: `${API_AUTH}/logout`,
  },
  USERS: {
    GET_ALL_USERS: `${API_USERS}`,
    GET_ME: `${API_USERS}/me`,
    UPDATE_USER_STATUS_BY_ID: (id) => `${API_USERS}/${id}/status`,
  },
};
