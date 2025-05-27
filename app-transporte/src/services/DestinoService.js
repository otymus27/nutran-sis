import { API } from '../services/api.js';

const API_URL = '/destino'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os destinos.
 * Retorna um array com objetos destino.
 * Cada destino possui, por exemplo: { id, nome, descricao }.
 */
export const getDestinos = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar destinos:', error);
    throw error;
  }
};

/**
 * Busca destinos de forma paginada.
 * @param {number} page - Número da página.
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getDestinosPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar destinos paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo destino.
 * O objeto "destino" deve conter as propriedades necessárias, por exemplo:
 * { nome: 'São Paulo', descricao: 'Cidade grande e movimentada' }
 */
export const addDestino = async (destino) => {
  try {
    const response = await API.post(API_URL, destino);
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
 * Atualiza um destino existente.
 * @param {number} id - ID do destino que será atualizado.
 * @param {Object} destino - Objeto com os dados atualizados do destino.
 */
export const updateDestino = async (id, destino) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, destino);
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
 * Exclui um destino.
 * @param {number} id - ID do destino a ser excluído.
 */
export const deleteDestino = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir destino:', error);
    throw error;
  }
};
