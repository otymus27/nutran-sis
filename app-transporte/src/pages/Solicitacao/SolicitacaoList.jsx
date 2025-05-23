import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { menuStructure } from '../../components/Menu/Menu';

const headerStyle = {
  fontWeight: 'bold',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
};

const SolicitacaoList = ({
  paginatedSolicitacoes = [],
  isLoading = false,
  user = { role: '' },
  onEditSolicitacao,
  onDeleteSolicitacao,
  sortConfig = { field: '', order: 'asc' },
  onSortChange,
}) => {
  // variaveis para uso do Menu
  const userRole = user?.roles?.[0]?.nome?.toUpperCase();

  const menu = menuStructure.find((menu) => menu.key === 'solicitacoes');
  const isDeleteDisabled = menu?.permissions?.disableDelete?.includes(userRole);
  const isEditDisabled = menu?.permissions?.disableEdit?.includes(userRole);

  // Função para renderizar ícone de ordenação
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? (
      <ArrowUpIcon fontSize="small" aria-label="Ordenado ascendente" />
    ) : (
      <ArrowDownIcon fontSize="small" aria-label="Ordenado descendente" />
    );
  };

  // Função para manipular clique de ordenação
  const handleSortClick = (field) => {
    onSortChange(field);
  };

  // Renderização enquanto carrega
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress aria-label="Carregando solicitações" />
      </Box>
    );
  }

  // Exibe mensagem se não houver registros
  if (paginatedSolicitacoes.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
        Nenhuma registro encontrada.
      </Typography>
    );
  }

  const calcularDistancia = (kmInicial, kmFinal) => {
    if (kmInicial == null || kmFinal == null) return '—';
    return kmFinal - kmInicial;
  };

  return (
    <TableContainer component={Paper} aria-label="Lista de solicitações">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={headerStyle}
              onClick={() => handleSortClick('dataSolicitacao')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSortClick('dataSolicitacao')}
              aria-sort={
                sortConfig.field === 'dataSolicitacao'
                  ? sortConfig.order === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              Data da Solicitação {renderSortIcon('dataSolicitacao')}
            </TableCell>

            <TableCell
              sx={headerStyle}
              onClick={() => handleSortClick('destino')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSortClick('destino')}
              aria-sort={
                sortConfig.field === 'destino' ? (sortConfig.order === 'asc' ? 'ascending' : 'descending') : 'none'
              }
            >
              Destino {renderSortIcon('destino')}
            </TableCell>

            <TableCell
              sx={headerStyle}
              onClick={() => handleSortClick('status')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSortClick('status')}
              aria-sort={
                sortConfig.field === 'status' ? (sortConfig.order === 'asc' ? 'ascending' : 'descending') : 'none'
              }
            >
              Status {renderSortIcon('status')}
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold' }}>Carro</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Motorista</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Setor</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Usuário</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Saida</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Km Inicial</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Chegada</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>KM Final</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>KM Total</TableCell>

            <TableCell sx={{ fontWeight: 'bold' }} align="center">
              Ações
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedSolicitacoes.map((s) => {
            const dataFormatada = s.dataSolicitacao ? new Date(s.dataSolicitacao).toLocaleDateString() : '—';

            return (
              <TableRow key={s.id} hover tabIndex={-1}>
                <TableCell>{dataFormatada}</TableCell>
                <TableCell>{s.destino || '—'}</TableCell>
                <TableCell>{s.status || '—'}</TableCell>
                <TableCell>{s.placaCarro}</TableCell>
                <TableCell>{s.nomeMotorista || '—'}</TableCell>
                <TableCell>{s.nomeSetor || '—'}</TableCell>
                <TableCell>{s.nomeUsuario || '—'}</TableCell>
                <TableCell>{s.horaSaida || '—'}</TableCell>
                <TableCell>{s.kmInicial || '—'}</TableCell>
                <TableCell>{s.horaChegada || '—'}</TableCell>
                <TableCell>{s.kmFinal || '—'}</TableCell>
                <TableCell>{calcularDistancia(s.kmInicial, s.kmFinal)}</TableCell> {/* ← Distância */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      disabled={isEditDisabled}
                      color="primary"
                      size="small"
                      onClick={() => onEditSolicitacao(s)}
                      aria-label={`Editar solicitação ${s.id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      disabled={isDeleteDisabled}
                      color="error"
                      size="small"
                      onClick={() => onDeleteSolicitacao(s.id)}
                      aria-label={`Excluir solicitação ${s.id}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SolicitacaoList;
