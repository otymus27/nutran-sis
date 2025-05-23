import { useState, useEffect, useCallback } from 'react';
import { getMotoristas, updateMotorista, deleteMotorista, addMotorista } from '../../services/MotoristaService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useMotoristasLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allMotoristas, setAllMotoristas] = useState([]);
  const [filteredMotoristas, setFilteredMotoristas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedMotorista, setSelectedMotorista] = useState(null);
  // Form data with fields: nome, matricula, telefone
  const [formData, setFormData] = useState({ nome: '', matricula: '', telefone: '' });

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMotoristas();
      // Add generated IDs if needed
      const processedData = data.map((motorista, index) => ({
        ...motorista,
        id: motorista.id || `generated-${index}`,
      }));
      setAllMotoristas(processedData);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar motoristas.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data initially and on fetchTrigger change
  useEffect(() => {
    fetchData();
  }, [fetchData, fetchTrigger]);

  // Filtering effect
  useEffect(() => {
    let currentData = [...allMotoristas];
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      currentData = allMotoristas.filter(
        (m) =>
          (m.nome && m.nome.toLowerCase().includes(term)) ||
          (m.matricula && m.matricula.toLowerCase().includes(term)) ||
          (m.telefone && m.telefone.toLowerCase().includes(term)),
      );
    }
    setFilteredMotoristas(currentData);
  }, [debouncedSearchTerm, allMotoristas]);

  // Modal Controls
  const handleOpenModal = (motorista = null) => {
    setSelectedMotorista(motorista);
    setFormData(
      motorista
        ? { nome: motorista.nome || '', matricula: motorista.matricula || '', telefone: motorista.telefone || '' }
        : { nome: '', matricula: '', telefone: '' },
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMotorista(null);
    setFormData({ nome: '', matricula: '', telefone: '' });
    setSearchTerm('');
  };

  // Operações CRUD
  const handleSave = async (dataToSend) => {
    setIsLoading(true);
    try {
      let responseMessage = '';

      if (selectedMotorista) {
        await updateMotorista(selectedMotorista.id, dataToSend);
        responseMessage = 'Registro atualizado com sucesso!';
      } else {
        await addMotorista(dataToSend);
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

  const handleDeleteMotorista = async (motoristaId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir motoristas.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteMotorista(motoristaId);
      setNotification({
        open: true,
        message: 'Motorista excluído com sucesso!',
        severity: 'success',
      });
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir motorista: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search Handling
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Notification Handling
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  return {
    // State
    allMotoristas,
    filteredMotoristas,
    searchTerm,
    isLoading,
    openModal,
    selectedMotorista,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteMotorista,
    handleSearchChange,
    handleCloseNotification,
  };
};
