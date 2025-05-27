import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth.jsx';
import { useSolicitacaoLogic } from '../../hooks/Solicitacao/useSolicitacaoLogic.jsx';

import SolicitacaoList from '../../pages/Solicitacao/SolicitacaoList.jsx';
import SolicitacaoModal from '../../components/Modals/SolicitacaoModal.jsx';
import GerarRelatorioSolicitacoes from '../../components/Relatorios/SolicitacaoRelatorios.jsx';

import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { menuStructure } from '../../components/Menu/Menu.jsx';

const ITEMS_PER_PAGE = 10;

const SolicitacaoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // variaveis para uso do Menu
  const userRole = user?.roles?.[0]?.nome?.toUpperCase();

  const menu = menuStructure.find((menu) => menu.key === 'solicitacoes');
  const isAddDisabled = menu?.permissions?.disableAdd?.includes(userRole);

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({ field: 'nome', order: 'asc' });

  const {
    filteredSolicitacoes,
    searchTerm,
    isLoading,
    openModal,
    selectedSolicitacao,
    formData,
    notification,
    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteSolicitacao,
    handleCloseNotification,
    setFormData,
    motoristas,
    setores,
    carros,
    destinos,
  } = useSolicitacaoLogic(user);

  // Ordena as solicitações conforme o campo e ordem da configuração
  const sortedSolicitacoes = useMemo(() => {
    if (!filteredSolicitacoes) return [];
    return [...filteredSolicitacoes].sort((a, b) => {
      const aVal = String(a[sortConfig.field] ?? '').toLowerCase();
      const bVal = String(b[sortConfig.field] ?? '').toLowerCase();
      return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filteredSolicitacoes, sortConfig]);

  // Lógica de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedSolicitacoes.length / itemsPerPage);
  const paginatedSolicitacoes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedSolicitacoes.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedSolicitacoes, currentPage]);

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
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
          <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome} sx={{ mb: 2 }}>
            Início
          </Button>

          <Typography variant="h4" gutterBottom>
            Gerenciamento de Solicitações
          </Typography>

          {/* Aqui é renderizado o campo de busca e botoes adicionar e gerar relatorio */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar solicitações por motorista ou destino..."
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <>
              <Button disabled={isAddDisabled} variant="contained" color="primary" onClick={() => handleOpenModal()}>
                Adicionar Solicitação
              </Button>

              <GerarRelatorioSolicitacoes solicitacoes={filteredSolicitacoes} loading={isLoading} />
            </>
          </Box>

          <SolicitacaoList
            paginatedSolicitacoes={paginatedSolicitacoes}
            isLoading={isLoading}
            user={user}
            onEditSolicitacao={handleOpenModal}
            onDeleteSolicitacao={handleDeleteSolicitacao}
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

      <SolicitacaoModal
        open={openModal}
        onClose={handleCloseModal}
        selectedSolicitacao={selectedSolicitacao}
        formData={formData}
        setFormData={setFormData} // ✅ ESSA LINHA É NECESSÁRIA
        onFormChange={handleFormChange}
        onSave={handleSave}
        isLoading={isLoading}
        user={user}
        motoristas={motoristas}
        setores={setores}
        carros={carros}
        destinos={destinos}
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

export default SolicitacaoPage;
