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

// import { useAuth } from '../../context/AuthContext';
import { menuStructure } from '../../components/Menu/Menu.jsx';

const CarroList = ({ paginatedCarros, isLoading, user, onEditCarro, onDeleteCarro, sortConfig, onSortChange }) => {
  // variaveis para uso do Menu
  const userRole = user?.roles?.[0]?.nome?.toUpperCase();

  const menu = menuStructure.find((menu) => menu.key === 'carros');
  const isDeleteDisabled = menu?.permissions?.disableDelete?.includes(userRole);
  const isEditDisabled = menu?.permissions?.disableEdit?.includes(userRole);

  // Função para renderizar ícone de ordenação
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  // Função para manipular clique de ordenação
  const handleSortClick = (field) => {
    onSortChange(field);
  };

  // Renderização de loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Exibe mensagem se não houver registros
  if (!paginatedCarros || paginatedCarros.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
        Nenhum registro encontrado.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('placa')}
            >
              Placa
              {renderSortIcon('placa')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('marca')}
            >
              Marca
              {renderSortIcon('marca')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('modelo')}
            >
              Modelo
              {renderSortIcon('modelo')}
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCarros.map((carro) => (
            <TableRow key={carro.id}>
              <TableCell>{carro.placa}</TableCell>
              <TableCell>{carro.marca}</TableCell>
              <TableCell>{carro.modelo}</TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton disabled={isEditDisabled} color="primary" size="small" onClick={() => onEditCarro(carro)}>
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    disabled={isDeleteDisabled}
                    color="error"
                    size="small"
                    onClick={() => onDeleteCarro(carro.id)}
                    aria-label={`Excluir solicitação ${carro.id}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CarroList;
