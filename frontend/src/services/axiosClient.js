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
    if (err.response?.status === 401) {
      //
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
