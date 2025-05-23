import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
};

const formatCarro = (carro) => {
  if (!carro) return '—';
  return `${carro.marca} ${carro.modelo} (${carro.placa})`;
};

const renderCell = (value) => value || '—';

const SolicitacaoTable = ({
  solicitacoes = [],
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isAdmin = false,
}) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Carro</TableCell>
            <TableCell>Motorista</TableCell>
            <TableCell>Setor</TableCell>
            <TableCell>Saída</TableCell>
            <TableCell>KM Inicial</TableCell>
            <TableCell>Chegada</TableCell>
            <TableCell>KM Final</TableCell>
            <TableCell>KM Total</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitacoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} align="center">
                Nenhuma solicitação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            solicitacoes.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>{s.id}</TableCell>
                <TableCell>{formatDate(s.dataSolicitacao)}</TableCell>
                <TableCell>{renderCell(s.destino)}</TableCell>
                <TableCell>{renderCell(s.status)}</TableCell>
                <TableCell>{formatCarro(s.carro)}</TableCell>
                <TableCell>{renderCell(s.motorista?.nome)}</TableCell>
                <TableCell>{renderCell(s.setor?.nome)}</TableCell>
                <TableCell>{renderCell(s.horaSaida)}</TableCell>
                <TableCell>{renderCell(s.kmInicial)}</TableCell>
                <TableCell>{renderCell(s.horaChegada)}</TableCell>
                <TableCell>{renderCell(s.kmFinal)}</TableCell>
                <TableCell>{s.kmInicial != null && s.kmFinal != null ? s.kmFinal - s.kmInicial : '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(s)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(s.id)}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
            shape="rounded"
          />
        </Box>
      )}
    </>
  );
};

export default SolicitacaoTable;
