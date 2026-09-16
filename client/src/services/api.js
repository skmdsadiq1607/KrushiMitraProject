import axios from "axios";
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "/api";
  const trimmed = envUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("crop_health_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me")
};
const diagnosisApi = {
  analyze: (formData) => api.post("/diagnosis/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  save: (data) => api.post("/diagnosis/save", data),
  getHistory: (params) => api.get("/diagnosis/history", { params }),
  getById: (id) => api.get(`/diagnosis/${id}`),
  delete: (id) => api.delete(`/diagnosis/${id}`)
};
const cropsApi = {
  getAll: () => api.get("/crops"),
  getById: (id) => api.get(`/crops/${id}`)
};
const diseasesApi = {
  getAll: (params) => api.get("/diseases", { params }),
  getById: (id) => api.get(`/diseases/${id}`)
};
const reportsApi = {
  getAll: () => api.get("/reports"),
  create: (data) => api.post("/reports", data),
  getById: (id) => api.get(`/reports/${id}`),
  delete: (id) => api.delete(`/reports/${id}`)
};
const weatherApi = {
  get: (lat, lng, location) => api.get("/weather", {
    params: { lat, lng, location }
  })
};
const assistantApi = {
  chat: (message, history) => api.post("/assistant/chat", {
    message,
    history
  })
};
var stdin_default = api;
export {
  assistantApi,
  authApi,
  cropsApi,
  stdin_default as default,
  diagnosisApi,
  diseasesApi,
  reportsApi,
  weatherApi
};
