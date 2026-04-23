import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://campus-backend-wmyw.onrender.com/api";
export const BASE_URL = API_URL.replace("/api", "");

const API = axios.create({
  baseURL: API_URL,
});

// Auth
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const completeProfile = (data) => API.post("/auth/complete-profile", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const changePassword = (data) => API.post("/auth/change-password", data);

// Student
export const getStudentProfile = (user_id) => API.get(`/student/profile/${user_id}`);
export const updateStudentProfile = (user_id, data) => API.put(`/student/profile/${user_id}`, data);
export const updateStudentResume = (user_id, formData) => API.put(`/student/profile/${user_id}/resume`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteStudentResume = (user_id) => API.delete(`/student/profile/${user_id}/resume`);
export const getStudentStats = (user_id) => API.get(`/student/stats/${user_id}`);
export const getStudentAnnouncements = () => API.get("/student/announcements");
export const getStudentSelected = () => API.get("/student/selected");

// Opportunities
export const getOpportunities = () => API.get("/opportunities");
export const addOpportunity = (data) => API.post("/opportunities", data);
export const applyOpportunity = (data) => API.post("/opportunities/apply", data);
export const getStudentApplications = (roll_no) => API.get(`/opportunities/applications/student/${roll_no}`);
export const getAllAdminApplications = () => API.get("/opportunities/applications");
export const updateApplicationStatus = (id, status) => API.put(`/opportunities/applications/${id}`, { status });

// TNP
export const getTNPStudents = () => API.get("/tnp/students");
export const getTNPStudentActivity = (roll_no) => API.get(`/tnp/students/${roll_no}/activity`);
export const addTNPAnnouncement = (data) => API.post("/tnp/announcements", data);
export const deleteTNPAnnouncement = (id) => API.delete(`/tnp/announcements/${id}`);

export default API;