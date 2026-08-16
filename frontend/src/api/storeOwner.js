import api from './axios';

export const getStoreOwnerDashboardApi = () => api.get('/store-owner/dashboard');
