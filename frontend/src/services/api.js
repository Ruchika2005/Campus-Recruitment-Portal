import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getStats = (user_id) => API.get(`/student/stats/${user_id}`);
export const getOpportunities = () => API.get("/opportunities");
export const addOpportunity = (data) => API.post("/opportunities", data);
export const getApplications = (roll_no) => API.get(`/applications/${roll_no}`);

export default API;