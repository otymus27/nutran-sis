import { useState, useEffect, useCallback } from 'react';
import { getDestinos, updateDestino, deleteDestino, addDestino } from '../../services/DestinoService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useDestinoLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allDestinos, setAllDestinos] = useState([]);
  const [filteredDestinos, setFilteredDestinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedDestino, setSelectedDestino] = useState(null);
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
      const data = await getDestinos();
      const processedData = data.map((destino, index) => ({
        ...destino,
        id: destino.id || `generated-${index}`,
      }));
      setAllDestinos(processedData);
    } catch (error) {
      console.error('Erro ao buscar destinos:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar destinos.',
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
    let currentData = [...allDestinos];
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      currentData = allDestinos.filter(
        (d) => (d.nome && d.nome.toLowerCase().includes(term)) || (d.codigo && d.codigo.toLowerCase().includes(term)),
      );
    }
    setFilteredDestinos(currentData);
  }, [debouncedSearchTerm, allDestinos]);

  // Modal Controls
  const handleOpenModal = (destino = null) => {
    setSelectedDestino(destino);
    setFormData(destino ? { nome: destino.nome || '', codigo: destino.codigo || '' } : { nome: '', codigo: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDestino(null);
    setFormData({ nome: '', codigo: '' });
    setSearchTerm('');
  };

  // Operações CRUD
  const handleSave = async (dataToSend) => {
    setIsLoading(true);
    try {
      let responseMessage = '';

      if (selectedDestino) {
        await updateDestino(selectedDestino.id, dataToSend);
        responseMessage = 'Registro atualizado com sucesso!';
      } else {
        await addDestino(dataToSend);
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

  const handleDeleteDestino = async (destinoId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir destinos.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteDestino(destinoId);
      setNotification({
        open: true,
        message: 'Destino excluído com sucesso!',
        severity: 'success',
      });
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir destino:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir destino: ${error.message || ''}`,
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
    allDestinos,
    filteredDestinos,
    searchTerm,
    isLoading,
    openModal,
    selectedDestino,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteDestino,
    handleSearchChange,
    handleCloseNotification,
  };
};
