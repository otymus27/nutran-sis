import { API } from '../services/api.js';

const API_URL = '/setor'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os setores.
 * Retorna um array com objetos setor.
 * Cada setor possui, por exemplo: { id, nome, descricao }.
 */
export const getSetores = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    throw error;
  }
};

/**
 * Busca setores de forma paginada.
 * @param {number} page - Número da página.
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getSetoresPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar setores paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo setor.
 * O objeto "setor" deve conter as propriedades necessárias, por exemplo:
 * { nome: 'Financeiro', descricao: 'Responsável pelas finanças' }
 */
export const addSetor = async (setor) => {
  try {
    const response = await API.post(API_URL, setor);
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
 * Atualiza um setor existente.
 * @param {number} id - ID do setor que será atualizado.
 * @param {Object} setor - Objeto com os dados atualizados do setor.
 */
export const updateSetor = async (id, setor) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, setor);
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
 * Exclui um setor.
 * @param {number} id - ID do setor a ser excluído.
 */
export const deleteSetor = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir setor:', error);
    throw error;
  }
};
