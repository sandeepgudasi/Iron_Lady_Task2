import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Programs
export const getPrograms = () => api.get('/programs/');
export const createProgram = (data) => api.post('/programs/', data);
export const deleteProgram = (id) => api.delete(`/programs/${id}`);

// Applications
export const getApplications = () => api.get('/applications/');
export const getProgramApplications = (programId) => api.get(`/programs/${programId}/applications`);
export const createApplication = (data) => api.post('/applications/', data);
export const updateApplicationStatus = (id, status) => api.put(`/applications/${id}/status`, { status });
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;
