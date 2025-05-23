import { useState, useEffect, useCallback } from 'react';
import { getCarros, addCarro, updateCarro, deleteCarro } from '../../services/CarroService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useCarroLogic = (user, fetchTrigger) => {
  // Estado de dados e UI
  const [allCarros, setAllCarros] = useState([]);
  const [filteredCarros, setFilteredCarros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado do modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedCarro, setSelectedCarro] = useState(null);
  // Dados do formulário com campos: modelo, placa, marca
  const [formData, setFormData] = useState({ modelo: '', placa: '', marca: '' });

  // Estado de notificação
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Termo de busca com debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCarros();
      const processedData = data.map((carro, index) => ({
        ...carro,
        id: carro.id || `generated-${index}`,
      }));
      setAllCarros(processedData);
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
      setNotification({
        open: true,
        message: 'Erro ao buscar carros.',
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
    let currentData = [...allCarros];
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      currentData = allCarros.filter(
        (c) =>
          (c.modelo && c.modelo.toLowerCase().includes(term)) ||
          (c.placa && c.placa.toLowerCase().includes(term)) ||
          (c.marca && c.marca.toLowerCase().includes(term)),
      );
    }
    setFilteredCarros(currentData);
  }, [debouncedSearchTerm, allCarros]);

  // Controle do modal
  const handleOpenModal = (carro = null) => {
    setSelectedCarro(carro);
    setFormData(
      carro
        ? { modelo: carro.modelo || '', placa: carro.placa || '', marca: carro.marca || '' }
        : { modelo: '', placa: '', marca: '' },
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCarro(null);
    setFormData({ modelo: '', placa: '', marca: '' });
    setSearchTerm('');
  };

  // Operações CRUD
  const handleSave = async (dataToSend) => {
    setIsLoading(true);
    try {
      let responseMessage = '';

      if (selectedCarro) {
        await updateCarro(selectedCarro.id, dataToSend);
        responseMessage = 'Registro atualizado com sucesso!';
      } else {
        await addCarro(dataToSend);
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

  const handleDeleteCarro = async (carroId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir carros.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteCarro(carroId);
      setNotification({
        open: true,
        message: 'Carro excluído com sucesso!',
        severity: 'success',
      });
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir carro: ${error.message || ''}`,
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
    allCarros,
    filteredCarros,
    searchTerm,
    isLoading,
    openModal,
    selectedCarro,
    formData,
    notification,

    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteCarro,
    handleSearchChange,
    handleCloseNotification,
  };
};
