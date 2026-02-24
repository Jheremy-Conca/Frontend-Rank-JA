import axios from "axios";

const API_URL = "https://backend-rank-ja.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
});

/* =======================
   GRUPOS
======================= */
export const getGroups = () => api.get("/groups");
export const addGroup = (data) => api.post("/groups", data);
export const addGroupPoints = (id, data) =>
  api.post(`/groups/${id}/add-points`, data);
export const subtractGroupPoints = (id, data) =>
  api.post(`/groups/${id}/subtract-points`, data);

/* =======================
   PERSONAS
======================= */
export const getPersons = () => api.get("/persons");
export const getPersonById = (id) => api.get(`/persons/${id}`);
export const addPerson = (data) => api.post("/persons", data);
export const updatePerson = (id, data) => api.put(`/persons/${id}`, data);
export const addPersonPoints = (id, data) =>
  api.post(`/persons/${id}/add-points`, data);
export const subtractPersonPoints = (id, data) =>
  api.post(`/persons/${id}/subtract-points`, data);

/* =======================
   RANKINGS
======================= */
export const getGroupRanking = () => api.get("/ranking/groups");
export const getPersonRanking = () => api.get("/ranking/persons");

/* =======================
   ACTIVIDADES
======================= */
export const getActivities = () => api.get("/activities");
