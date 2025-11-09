import axios from "axios";

// Flask backend URL (adjust if hosted on AWS later)
const API = axios.create({
  baseURL: "YOUR-BACKEND-DEPLOY-URL/api",
});

// Get all analyzed repos
export const fetchRepos = () => API.get("/repos");

// Add a new repo to analyze

export const addRepo = (data) => API.post("/repos", data);
