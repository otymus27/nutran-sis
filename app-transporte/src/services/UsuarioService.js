import { API } from '../services/api.js';

const API_URL = '/usuarios'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os usuários.
 * Retorna um array com objetos usuário.
 * Cada usuário possui, por exemplo: { id, login, roles }.
 */
export const getUsuarios = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data; // Ex.: [{ id, login, roles }, ...]
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

/**
 * Busca usuários de forma paginada.
 * @param {number} page - Número da página (normalmente começando em 0 ou 1, conforme seu backend).
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getUsuariosPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo usuário.
 * O objeto "usuario" deve conter as propriedades necessárias, por exemplo:
 * { login: 'fulano', roles: [{ id: 1, nome: 'ADMIN' }] }
 */
export const addUsuario = async (usuario) => {
  try {
    const response = await API.post(API_URL, usuario);
    return response.data;
  } catch (error) {
    const status = error.response.status;
    const data = error.response.data;
    if (status === 409) {
      // Violação de integridade
      throw new Error(data.mensagem || 'Não foi possível cadastrar.');
    } else {
      // Outros erros
      throw new Error('Erro na comunicação com o servidor.');
    }
  }
};

/**
 * Atualiza um usuário existente.
 * @param {number} id - ID do usuário que será atualizado.
 * @param {Object} usuario - Objeto com os dados atualizados do usuário.
 */
export const updateUsuario = async (id, usuario) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, usuario);
    return response.data;
  } catch (error) {
    const status = error.response.status;
    const data = error.response.data;
    if (status === 409) {
      // Violação de integridade
      throw new Error(data.mensagem || 'Não foi possível alterar.');
    } else {
      // Outros erros
      throw new Error('Erro na comunicação com o servidor.');
    }
  }
};

/**
 * Exclui um usuário.
 * @param {number} id - ID do usuário a ser excluído.
 */
export const deleteUsuario = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

/**
 * Gera senha provisória para um usuário.
 * @param {number} id - ID do usuário para o qual a senha será gerada.
 */
export const gerarSenhaProvisoria = async (id) => {
  try {
    const response = await API.post('/recuperar-senha/gerar-provisoria', { id });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar senha provisória:', error);
    throw error;
  }
};

/**
 * Confirma a redefinição de senha.
 * @param {Object} dados - Dados necessários para redefinir a senha.
 * @param {number} dados.id - ID do usuário.
 * @param {string} dados.senhaProvisoria - Senha provisória.
 * @param {string} dados.novaSenha - Nova senha.
 */
export const confirmarRedefinicao = async ({ id, senhaProvisoria, novaSenha }) => {
  try {
    const response = await API.post('/recuperar-senha/confirmar-redefinicao', {
      id,
      senhaProvisoria,
      novaSenha,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar redefinição de senha:', error);
    throw error;
  }
};
