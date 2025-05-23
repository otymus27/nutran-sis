import { useState, useEffect, useCallback } from 'react';
import { getSetores, updateSetor, deleteSetor, addSetor } from '../../services/SetorService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useSetorLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allSetores, setAllSetores] = useState([]);
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedSetor, setSelectedSetor] = useState(null);
  const [formData, setFormData] = useState({ nome: '', codigo: '' });

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
      const data = await getSetores();
      const processedData = data.map((setor, index) => ({
        ...setor,
        id: setor.id || `generated-${index}`,
      }));
      setAllSetores(processedData);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar setores.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, fetchTrigger]);

  useEffect(() => {
    let currentData = [...allSetores];
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      currentData = allSetores.filter(
        (s) => (s.nome && s.nome.toLowerCase().includes(term)) || (s.codigo && s.codigo.toLowerCase().includes(term)),
      );
    }
    setFilteredSetores(currentData);
  }, [debouncedSearchTerm, allSetores]);

  // Modal Controls
  const handleOpenModal = (setor = null) => {
    setSelectedSetor(setor);
    setFormData(setor ? { nome: setor.nome || '', codigo: setor.codigo || '' } : { nome: '', codigo: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSetor(null);
    setFormData({ nome: '', codigo: '' });
    setSearchTerm('');
  };

  // Operações CRUD
  const handleSave = async (dataToSend) => {
    setIsLoading(true);
    try {
      let responseMessage = '';

      if (selectedSetor) {
        await updateSetor(selectedSetor.id, dataToSend);
        responseMessage = 'Registro atualizado com sucesso!';
      } else {
        await addSetor(dataToSend);
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

  const handleDeleteSetor = async (setorId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir setores.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteSetor(setorId);
      setNotification({
        open: true,
        message: 'Setor excluído com sucesso!',
        severity: 'success',
      });
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir setor:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir setor: ${error.message || ''}`,
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
    allSetores,
    filteredSetores,
    searchTerm,
    isLoading,
    openModal,
    selectedSetor,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteSetor,
    handleSearchChange,
    handleCloseNotification,
  };
};
