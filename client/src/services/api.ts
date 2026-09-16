import axios from 'axios';
import {
  User,
  DiagnosisResult,
  Crop,
  Disease,
  FieldReport,
  WeatherData
} from '../types';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crop_health_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: (data: any) => api.post<{ success: boolean; token: string; user: User }>('/auth/register', data),
  login: (data: any) => api.post<{ success: boolean; token: string; user: User }>('/auth/login', data),
  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me')
};

// Diagnosis API
export const diagnosisApi = {
  analyze: (formData: FormData) =>
    api.post<{ success: boolean; data: DiagnosisResult }>('/diagnosis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  save: (data: Partial<DiagnosisResult>) =>
    api.post<{ success: boolean; message: string; data: DiagnosisResult }>('/diagnosis/save', data),
  getHistory: (params?: { crop?: string; severity?: string; search?: string }) =>
    api.get<{ success: boolean; count: number; data: DiagnosisResult[] }>('/diagnosis/history', { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: DiagnosisResult }>(`/diagnosis/${id}`),
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/diagnosis/${id}`)
};

// Crops & Diseases API
export const cropsApi = {
  getAll: () => api.get<{ success: boolean; count: number; data: Crop[] }>('/crops'),
  getById: (id: string) => api.get<{ success: boolean; data: Crop }>(`/crops/${id}`)
};

export const diseasesApi = {
  getAll: (params?: { crop?: string; type?: string; search?: string }) =>
    api.get<{ success: boolean; count: number; data: Disease[]; sources: any[] }>('/diseases', { params }),
  getById: (id: string) => api.get<{ success: boolean; data: Disease }>(`/diseases/${id}`)
};

// Field Reports API
export const reportsApi = {
  getAll: () => api.get<{ success: boolean; count: number; data: FieldReport[] }>('/reports'),
  create: (data: Partial<FieldReport>) => api.post<{ success: boolean; data: FieldReport }>('/reports', data),
  getById: (id: string) => api.get<{ success: boolean; data: FieldReport }>(`/reports/${id}`),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/reports/${id}`)
};

// Weather API
export const weatherApi = {
  get: (lat?: number, lng?: number, location?: string) =>
    api.get<{ success: boolean; data: WeatherData }>('/weather', {
      params: { lat, lng, location }
    })
};

// Agriculture Assistant Chat API
export const assistantApi = {
  chat: (message: string, history?: { sender: string; text: string }[]) =>
    api.post<{ success: boolean; data: { reply: string; sources: string[]; isAiGenerated: boolean } }>('/assistant/chat', {
      message,
      history
    })
};

export default api;
