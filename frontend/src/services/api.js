import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  submitDailyUpdate: (data) => api.post('/student/daily-update', data),
  getDailyUpdates: () => api.get('/student/daily-updates'),
  submitWeeklyUpdate: (data) => api.post('/student/weekly-update', data),
  getWeeklyUpdates: () => api.get('/student/weekly-updates'),
  getAttendance: () => api.get('/student/attendance'),
  getMarks: () => api.get('/student/marks'),
};

// Mentor API
export const mentorAPI = {
  getDashboard: () => api.get('/mentor/dashboard'),
  getAssignedGroups: () => api.get('/mentor/groups'),
  getGroupDetails: (groupId) => api.get(`/mentor/group/${groupId}`),
  getStudentDetails: (studentId) => api.get(`/mentor/students/${studentId}`),
  getStudentDailyUpdates: (studentId) => api.get(`/mentor/students/${studentId}/daily-updates`),
  getStudentWeeklyUpdates: (studentId) => api.get(`/mentor/students/${studentId}/weekly-updates`),
  addAttendance: (data) => api.post('/mentor/attendance', data),
  giveMarks: (data) => api.post('/mentor/marks', data),
  getGroupAttendanceSummary: (groupId) => api.get(`/mentor/group/${groupId}/attendance`),
  searchStudents: (params) => api.get('/mentor/students', { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  // Batches
  createBatch: (data) => api.post('/admin/batches', data),
  getAllBatches: () => api.get('/admin/batches'),
  updateBatch: (batchId, data) => api.put(`/admin/batches/${batchId}`, data),
  deleteBatch: (batchId) => api.delete(`/admin/batches/${batchId}`),
  // Groups
  createGroup: (data) => api.post('/admin/groups', data),
  getAllGroups: () => api.get('/admin/groups'),
  updateGroup: (groupId, data) => api.put(`/admin/groups/${groupId}`, data),
  deleteGroup: (groupId) => api.delete(`/admin/groups/${groupId}`),
  // Mentors
  createMentor: (data) => api.post('/admin/mentors', data),
  getAllMentors: () => api.get('/admin/mentors'),
  updateMentor: (mentorId, data) => api.put(`/admin/mentors/${mentorId}`, data),
  deleteMentor: (mentorId) => api.delete(`/admin/mentors/${mentorId}`),
  assignMentorToBatches: (mentorId, data) => api.post(`/admin/mentors/${mentorId}/assign-batches`, data),
  // Students
  addStudent: (data) => api.post('/admin/students', data),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  updateStudent: (studentId, data) => api.put(`/admin/students/${studentId}`, data),
  deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
};

export default api;