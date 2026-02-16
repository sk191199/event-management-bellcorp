// This file handles API calls to backend

import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ENDPOINTS ==========

// Register API
export const registerUser = (data) => {
  return API.post("/auth/signup", data);
};

// Login API
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// ========== EVENTS ENDPOINTS ==========

// Get All Events with Search & Filter
export const getEvents = (params) => {
  return API.get("/events", { params });
};

// Get Single Event
export const getEventDetails = (eventId) => {
  return API.get(`/events/${eventId}`);
};

// Get User's Registered Events
export const getUserEvents = () => {
  return API.get("/events/user/registrations/all");
};

// ========== REGISTRATION ENDPOINTS ==========

// Register for Event
export const registerForEvent = (eventId) => {
  return API.post(`/register/${eventId}`);
};

// Unregister from Event
export const unregisterFromEvent = (eventId) => {
  return API.delete(`/register/${eventId}`);
};

// Check if User is Registered
export const checkRegistration = (eventId) => {
  return API.get(`/register/${eventId}/check`);
};

export default API;

