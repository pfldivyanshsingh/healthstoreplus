import api from './api';

export const healthVitalService = {
  getAll: async (params = {}) => {
    const response = await api.get('/health-vitals', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/health-vitals/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/health-vitals', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/health-vitals/${id}`, data);
    return response.data;
  },

  getCritical: async () => {
    const response = await api.get('/health-vitals/alerts/critical');
    return response.data;
  }
};
