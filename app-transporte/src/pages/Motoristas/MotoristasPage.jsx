import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useMotoristasLogic } from '../../hooks/Motoristas/UseMotoristasLogic.jsx';
import MotoristasList from './MotoristasList.jsx';
import MotoristaModal from '../../components/Modals/MotoristaModal.jsx';
import GerarRelatorioMotoristas from '../../components/Relatorios/MotoristasRelatorio.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { menuStructure } from '../../components/Menu/Menu.jsx';

const MotoristasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // variaveis para uso do Menu
  const userRole = user?.roles?.[0]?.nome?.toUpperCase();

  const menu = menuStructure.find((menu) => menu.key === 'motoristas');
  const isAddDisabled = menu?.permissions?.disableAdd?.includes(userRole);

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({ field: 'nome', order: 'asc' });

  const {
    filteredMotoristas,
    searchTerm,
    isLoading,
    openModal,
    selectedMotorista,
    formData,
    notification,
    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteMotorista,
    handleCloseNotification,
    setFormData,
  } = useMotoristasLogic(user);

  // Ordena as solicitações conforme o campo e ordem da configuração
  const sortedMotoristas = useMemo(() => {
    if (!filteredMotoristas) return [];
    return [...filteredMotoristas].sort((a, b) => {
      const valueA = String(a[sortConfig.field] || '').toLowerCase();
      const valueB = String(b[sortConfig.field] || '').toLowerCase();
      return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }, [filteredMotoristas, sortConfig]);

  // Lógica de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedMotoristas.length / itemsPerPage);
  const paginatedMotoristas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMotoristas.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMotoristas, currentPage]);

  // Muda página da paginação
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Alterna ordenação por campo
  const handleSortChange = (field) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return { field, order: prevConfig.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field, order: 'asc' };
    });
    setCurrentPage(1);
  };

  // Navegar para página inicial
  const handleGoHome = () => navigate('/home');

  // Atualizar formulário no modal
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Se não houver usuário autenticado, exibe uma mensagem de erro
  if (!user) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Erro ao carregar dados do usuário. Por favor, faça login novamente.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <CustomHeader />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome}>
            Início
          </Button>

          <Typography variant="h4" gutterBottom>
            Gerenciamento de Motoristas
          </Typography>

          {/* Aqui é renderizado o campo de busca e botoes adicionar e gerar relatorio */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar motoristas por nome, matrícula ou telefone..."
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <>
              <Button disabled={isAddDisabled} variant="contained" color="primary" onClick={() => handleOpenModal()}>
                Adicionar Motorista
              </Button>
              <GerarRelatorioMotoristas motoristas={filteredMotoristas} loading={isLoading} />
            </>
          </Box>

          <MotoristasList
            paginatedMotoristas={paginatedMotoristas}
            isLoading={isLoading}
            user={user}
            onEditMotorista={handleOpenModal}
            onDeleteMotorista={handleDeleteMotorista}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />

          {totalPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
        <Footer />
      </Box>

      <MotoristaModal
        open={openModal}
        onClose={handleCloseModal}
        selectedMotorista={selectedMotorista}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSave}
        isLoading={isLoading}
        user={user}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MotoristasPage;
