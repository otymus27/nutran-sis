import { useState, useEffect, useCallback } from 'react';
import {
  getSolicitacoes,
  updateSolicitacao,
  deleteSolicitacao,
  addSolicitacao,
} from '../../services/SolicitacaoService.js';
import useDebounce from '../../hooks/useDebounce.js';
import { getMotoristas } from '../../services/MotoristaService.js';
import { getSetores } from '../../services/SetorService.js';
import { getCarros } from '../../services/CarroService.js';

export const useSolicitacaoLogic = (user, fetchTrigger) => {
  const [allSolicitacoes, setAllSolicitacoes] = useState([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [motoristas, setMotoristas] = useState([]);
  const [setores, setSetores] = useState([]);
  const [carros, setCarros] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);

  const initialFormData = {
    idMotorista: '',
    idSetor: '',
    idCarro: '',
    destino: '',
    dataSolicitacao: new Date().toISOString().split('T')[0],
    status: 'PENDENTE',
    horaSaida: '',
    kmInicial: '',
    horaChegada: '',
    kmFinal: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchListas = useCallback(async () => {
    try {
      const [motoristasData, setoresData, carrosData] = await Promise.all([getMotoristas(), getSetores(), getCarros()]);
      setMotoristas(motoristasData);
      setSetores(setoresData);
      setCarros(carrosData);
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar dados auxiliares.',
        severity: 'error',
      });
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitacoes();
      const processedData = data.map((s, index) => ({
        ...s,
        id: s.id || `generated-${index}`,
      }));
      setAllSolicitacoes(processedData);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar solicitações.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchListas();
  }, [fetchData, fetchListas, fetchTrigger]);

  useEffect(() => {
    let currentData = allSolicitacoes;
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      currentData = allSolicitacoes.filter(
        (s) =>
          (s.destino && s.destino.toLowerCase().includes(term)) ||
          (s.nomeMotorista && s.nomeMotorista.toLowerCase().includes(term)),
      );
    }
    setFilteredSolicitacoes(currentData);
  }, [debouncedSearchTerm, allSolicitacoes]);

  const handleOpenModal = (solicitacao = null) => {
    setSelectedSolicitacao(solicitacao);
    setFormData(
      solicitacao
        ? {
            idMotorista: solicitacao.idMotorista || '',
            idSetor: solicitacao.idSetor || '',
            idCarro: solicitacao.idCarro || '',
            destino: solicitacao.destino || '',
            dataSolicitacao: solicitacao.dataSolicitacao || new Date().toISOString().split('T')[0],
            status: solicitacao.status || 'PENDENTE',
            horaSaida: solicitacao.horaSaida || '',
            kmInicial: solicitacao.kmInicial || '',
            horaChegada: solicitacao.horaChegada || '',
            kmFinal: solicitacao.kmFinal || '',
          }
        : initialFormData,
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSolicitacao(null);
    setFormData(initialFormData);
  };

  const handleSave = async (dataToSend) => {
    setIsLoading(true);
    try {
      let responseMessage = '';

      if (selectedSolicitacao) {
        await updateSolicitacao(selectedSolicitacao.id, dataToSend);
        responseMessage = 'Registro atualizado com sucesso!';
      } else {
        await addSolicitacao(dataToSend); // Sugiro criar createSolicitacao
        responseMessage = 'Registro adicionado com sucesso!';
      }

      setNotification({
        open: true,
        message: responseMessage,
        severity: 'success',
      });

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      setNotification({
        open: true,
        message: `Erro ao salvar registro: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSolicitacao = async (id) => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'GERENTE')) {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir solicitações.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteSolicitacao(id);
      setNotification({
        open: true,
        message: 'Solicitação excluída com sucesso!',
        severity: 'success',
      });
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir solicitação: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return {
    allSolicitacoes,
    filteredSolicitacoes,
    searchTerm,
    isLoading,
    openModal,
    selectedSolicitacao,
    formData,
    notification,
    motoristas,
    setores,
    carros,

    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteSolicitacao,
    handleSearchChange,
    handleCloseNotification,
  };
};
