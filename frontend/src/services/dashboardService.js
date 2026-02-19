import api from './api';

export const dashboardService = {
  getAdmin: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getStore: async () => {
    const response = await api.get('/dashboard/store');
    return response.data;
  },

  getDoctor: async () => {
    const response = await api.get('/dashboard/doctor');
    return response.data;
  },

  getPatient: async () => {
    const response = await api.get('/dashboard/patient');
    return response.data;
  }
};
