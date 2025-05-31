import { AxiosError } from 'axios'; // Opcional, mas bom para tipagem

/**
 * Interpreta e formata mensagens de erro do Axios.
 * @param {AxiosError | any} error - O objeto de erro do Axios (ou qualquer erro).
 * @returns {string} Uma mensagem de erro formatada e amigável.
 */
export const parseAxiosError = (error) => {
  if (error.isAxiosError) {
    // Verifica se é um erro do Axios (propriedade adicionada pelo Axios)
    if (error.response) {
      // O servidor respondeu com um status fora da faixa 2xx
      const { status, data } = error.response;

      // ✅ Ajuste para capturar a estrutura de erro personalizada
      if (status === 401 && data && typeof data === 'object' && data.erro && data.mensagem) {
        return `${data.erro}: ${data.mensagem}`;
      }

      const serverMessage = data && typeof data === 'object' && (data.mensagem || data.message);

      if (serverMessage) {
        return serverMessage;
      }

      return `Erro ${status}: Ocorreu um problema com o servidor.`;
    } else if (error.request) {
      // A requisição foi feita mas nenhuma resposta foi recebida
      return 'Servidor não respondeu. Verifique sua conexão ou tente novamente mais tarde.';
    }
  }
  // Erro ao configurar a requisição ou um erro não-Axios
  console.error('Erro na requisição ou erro inesperado:', error); // Log para debug
  return 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
};
