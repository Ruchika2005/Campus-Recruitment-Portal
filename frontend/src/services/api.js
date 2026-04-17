import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getStats = (user_id) => API.get(`/student/stats/${user_id}`);
export const getOpportunities = () => API.get("/opportunities");
export const addOpportunity = (data) => API.post("/opportunities", data);
export const applyOpportunity = (data) => API.post("/opportunities/apply", data);
export const getStudentApplications = (roll_no) => API.get(`/opportunities/applications/student/${roll_no}`);
export const getAllAdminApplications = () => API.get("/opportunities/applications");
export const updateApplicationStatus = (id, status) => API.put(`/opportunities/applications/${id}`, { status });
export default API;