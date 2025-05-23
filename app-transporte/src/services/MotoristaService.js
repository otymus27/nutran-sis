import { API } from '../services/api.js';

const API_URL = '/motorista'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os motoristas.
 * Retorna um array com objetos motorista.
 * Cada motorista possui, por exemplo: { id, nome, cpf, telefone }.
 */
export const getMotoristas = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    throw error;
  }
};

/**
 * Busca motoristas de forma paginada.
 * @param {number} page - Número da página.
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getMotoristasPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar motoristas paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo motorista.
 * O objeto "motorista" deve conter as propriedades necessárias, por exemplo:
 * { nome: 'Fulano', cpf: '000.000.000-00', telefone: '99999-9999' }
 */
export const addMotorista = async (motorista) => {
  try {
    const response = await API.post(API_URL, motorista);
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
 * Atualiza um motorista existente.
 * @param {number} id - ID do motorista que será atualizado.
 * @param {Object} motorista - Objeto com os dados atualizados do motorista.
 */
export const updateMotorista = async (id, motorista) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, motorista);
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
 * Exclui um motorista.
 * @param {number} id - ID do motorista a ser excluído.
 */
export const deleteMotorista = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir motorista:', error);
    throw error;
  }
};
