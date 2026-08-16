import api from './axios';

export const listStoresForUserApi = (params) => api.get('/stores', { params });
export const submitRatingApi = (data) => api.post('/stores/ratings', data);
