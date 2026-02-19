import api from './api';

export const patientService = {
  getAll: async (params = {}) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  getRecords: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/records`);
    return response.data;
  },

  createRecord: async (patientId, data) => {
    const response = await api.post(`/patients/${patientId}/records`, data);
    return response.data;
  },

  getRecord: async (recordId) => {
    const response = await api.get(`/patients/records/${recordId}`);
    return response.data;
  },

  updateRecord: async (recordId, data) => {
    const response = await api.put(`/patients/records/${recordId}`, data);
    return response.data;
  }
};
