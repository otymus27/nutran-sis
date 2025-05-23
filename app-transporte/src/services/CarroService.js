import { API } from '../services/api.js';

const API_URL = '/carro'; // Ajuste conforme sua configuração de backend
const API_URL_1 = '/carro/paginado/';

/**
 * Busca todos os carros.
 * Retorna um array com objetos carro.
 * Cada carro possui, por exemplo: { id, placa, modelo, marca }.
 */
export const getCarros = async () => {
  try {
    const response = await API.get(API_URL);
    console.log('Carros:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    throw error;
  }
};

/**
 * Busca carros de forma paginada.
 * @param {number} page - Número da página.
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getCarrosPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL_1}?page=${page}&size=${size}`);
    console.log('Carros:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar carros paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo carro.
 * O objeto "carro" deve conter as propriedades necessárias, por exemplo:
 * { placa: 'ABC-1234', modelo: 'Civic', marca: 'Honda' }
 */
export const addCarro = async (carro) => {
  try {
    const response = await API.post(API_URL, carro);
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
 * Atualiza um carro existente.
 * @param {number} id - ID do carro que será atualizado.
 * @param {Object} carro - Objeto com os dados atualizados do carro.
 */
export const updateCarro = async (id, carro) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, carro);
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
 * Exclui um carro.
 * @param {number} id - ID do carro a ser excluído.
 */
export const deleteCarro = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir carro:', error);
    throw error;
  }
};
