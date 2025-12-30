// ==================== AXIOS INSTANCE CONFIGURATION ====================
import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Re-usable axios instance
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response ? err.response.status : null;

    if (status === 401) {
      console.warn("Unauthorized - Session expired or invalid");
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
