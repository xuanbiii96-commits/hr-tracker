import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }),
};

export const leaveService = {
  getBalance: () => api.get('/leave/balance'),
  requestLeave: (leaveTypeId, startDate, endDate, reason) =>
    api.post('/leave/request', { leaveTypeId, startDate, endDate, reason }),
  getRequests: (status) => api.get('/leave/requests', { params: { status } }),
  approveLeave: (id) => api.put(`/leave/request/${id}/approve`),
  rejectLeave: (id, reason) => api.put(`/leave/request/${id}/reject`, { reason }),
};

export const shiftService = {
  assignShift: (userId, shiftId, assignedDate) =>
    api.post('/shifts/assign', { userId, shiftId, assignedDate }),
  getAssignments: (userId, startDate, endDate) =>
    api.get('/shifts/assignments', { params: { userId, startDate, endDate } }),
  requestSwap: (targetUserId, shiftAssignmentId, reason) =>
    api.post('/shifts/swap/request', { targetUserId, shiftAssignmentId, reason }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getNotifications: () => api.get('/users/notifications'),
  getCalendarEvents: (start, end, userId) =>
    api.get('/users/calendar/events', { params: { start, end, userId } }),
};

export const attendanceService = {
  checkIn: () => api.post('/attendance/check-in'),
  checkOut: () => api.post('/attendance/check-out'),
  getRecords: (startDate, endDate) =>
    api.get('/attendance', { params: { startDate, endDate } }),
};

export const analyticsService = {
  getDashboard: (month, year) => api.get('/analytics/dashboard', { params: { month, year } }),
  getLeaveReport: (startDate, endDate) =>
    api.get('/analytics/leave-report', { params: { startDate, endDate } }),
  getAttendanceReport: (month, year) =>
    api.get('/analytics/attendance-report', { params: { month, year } }),
};
