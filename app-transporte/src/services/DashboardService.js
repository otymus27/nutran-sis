import { API } from '../services/api.js';

const API_URL = '/dashboard'; // Ajuste conforme sua configuração de backend

export const getDashboard = async () => {
  try {
    const response = await API.get(`${API_URL}`);
    console.log('Dados do dashboard:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return null;
  }
};
