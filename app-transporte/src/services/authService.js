// import API, { setAuthToken } from './api';
import { API, setAuthToken } from './api.js'; // ✅ Correto: API é uma named export
import { parseAxiosError } from './parseAxiosError.js';

/**
 * Faz login e define o token de autenticação
 */
export const login = async (login, senha) => {
  try {
    //const response = await API.post('/login', { login, senha });
    const response = await API.post('/login', { login, senha });
    const token = response.data.accessToken;

    if (!token) throw new Error('Token de acesso não retornado pela API');

    setAuthToken(token);
    if (import.meta.env.DEV) console.log('Resposta do login:', response.data);
    return response.data;
  } catch (error) {
    throw new Error(parseAxiosError(error));
  }
};

/**
 * Busca os dados do usuário autenticado
 */
export const fetchUserData = async () => {
  try {
    const response = await API.get('/usuarios/logado');
    if (import.meta.env.DEV) console.log('Resposta do fetchUserData:', response.data);

    const user = Array.isArray(response.data) ? response.data[0] : response.data;

    // ✅ Adiciona o campo `role` com base no primeiro valor de `roles`
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      user.role = user.roles[0]; // Ex: 'ADMIN', 'BASIC', etc.
    }

    return user;
  } catch (error) {
    if (import.meta.env.DEV) console.error('Erro no fetchUserData:', error);
    throw new Error(parseAxiosError(error));
  }
};
