import api from './axios';

export const getDashboardApi = () => api.get('/admin/dashboard');
export const createUserApi = (data) => api.post('/admin/users', data);
export const listUsersApi = (params) => api.get('/admin/users', { params });
export const getUserDetailsApi = (id) => api.get(`/admin/users/${id}`);
export const createStoreApi = (data) => api.post('/admin/stores', data);
export const listStoresApi = (params) => api.get('/admin/stores', { params });
