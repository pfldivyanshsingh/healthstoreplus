import api from './api';

export const orderService = {
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id, status, paymentStatus) => {
    const response = await api.put(`/orders/${id}/status`, { status, paymentStatus });
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};
