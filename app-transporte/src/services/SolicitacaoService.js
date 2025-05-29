import { API } from '../services/api.js';

const API_URL = '/solicitacao'; // Ajuste conforme a configuração do seu backend

/**
 * Busca todas as solicitações.
 * Retorna um array com objetos de solicitação.
 * Cada solicitação pode conter: { id, dataSolicitacao, status, cliente, itens }.
 */
export const getSolicitacoes = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    throw error;
  }
};

/**
 * Busca solicitações de forma paginada.
 * @param {number} page - Número da página.
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getSolicitacoesPaginated = async (page, size) => {
  try {
    const response = await API.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar solicitações paginadas:', error);
    throw error;
  }
};

/**
 * Adiciona uma nova solicitação.
 * O objeto "solicitacao" deve conter as propriedades necessárias, por exemplo:
 * { dataSolicitacao: '2025-05-18', clienteId: 1, itens: [ ... ] }
 */
export const addSolicitacao = async (solicitacao) => {
  try {
    const response = await API.post(API_URL, solicitacao);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar solicitação:', error);
    throw error;
  }
};

/**
 * Atualiza uma solicitação existente.
 * @param {number} id - ID da solicitação que será atualizada.
 * @param {Object} solicitacao - Objeto com os dados atualizados da solicitação.
 */
export const updateSolicitacao = async (id, solicitacao) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, solicitacao);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar solicitação:', error);
    throw error;
  }
};

/**
 * Exclui uma solicitação.
 * @param {number} id - ID da solicitação a ser excluída.
 */
export const deleteSolicitacao = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir solicitação:', error);
    throw error;
  }
};

/**
 * Consulta personalizada de solicitações com múltiplos filtros.
 * @param {Object} filtros - Objeto contendo os filtros: motorista, placa, destino, setor, dataInicio, dataFim.
 * @returns {Array} Lista de solicitações filtradas.
 */
export const consultarSolicitacoes = async (filtros, page = 0, size = 10) => {
  try {
    const params = {
      motoristaId: filtros.motoristaId || null,
      carroId: filtros.carroId || null,
      destinoId: filtros.destinoId || null,
      setorId: filtros.setorId || null,
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null,
      page,
      size,
    };

    console.log('Enviando filtros:', params); // ✅ LOG importante!

    const response = await API.get(`${API_URL}/filtro`, { params });

    console.log('Resposta da API:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar solicitações:', error);
    throw error;
  }
};
