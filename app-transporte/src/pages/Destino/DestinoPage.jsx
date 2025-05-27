import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useDestinoLogic } from '../../hooks/Destino/UseDestinoLogic.jsx';
import DestinoList from '../../pages/Destino/DestinoList.jsx';
import DestinoModal from '../../components/Modals/DestinoModal.jsx';
import GerarRelatorioDestinos from '../../components/Relatorios/DestinoRelatorio.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { menuStructure } from '../../components/Menu/Menu.jsx';

const DestinoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // variáveis para uso do Menu
  const userRole = user?.roles?.[0]?.nome?.toUpperCase();

  const menu = menuStructure.find((menu) => menu.key === 'destinos');
  const isAddDisabled = menu?.permissions?.disableAdd?.includes(userRole);

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({ field: 'nome', order: 'asc' });

  const {
    filteredDestinos,
    searchTerm,
    isLoading,
    openModal,
    selectedDestino,
    formData,
    notification,
    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteDestino,
    handleCloseNotification,
    setFormData,
  } = useDestinoLogic(user);

  // Ordena os destinos conforme campo e ordem
  const sortedDestinos = useMemo(() => {
    if (!filteredDestinos) return [];
    return [...filteredDestinos].sort((a, b) => {
      const valueA = String(a[sortConfig.field] || '').toLowerCase();
      const valueB = String(b[sortConfig.field] || '').toLowerCase();
      return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }, [filteredDestinos, sortConfig]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedDestinos.length / itemsPerPage);
  const paginatedDestinos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDestinos.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDestinos, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Alterna ordenação
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

  // Atualiza formulário do modal
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
            Gerenciamento de Destinos
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar destino por nome..."
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <>
              <Button disabled={isAddDisabled} variant="contained" color="primary" onClick={() => handleOpenModal()}>
                Adicionar Destino
              </Button>
              <GerarRelatorioDestinos destinos={filteredDestinos} loading={isLoading} />
            </>
          </Box>

          <DestinoList
            paginatedDestinos={paginatedDestinos}
            isLoading={isLoading}
            user={user}
            onEditDestino={handleOpenModal}
            onDeleteDestino={handleDeleteDestino}
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

      <DestinoModal
        open={openModal}
        onClose={handleCloseModal}
        selectedDestino={selectedDestino}
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

export default DestinoPage;
