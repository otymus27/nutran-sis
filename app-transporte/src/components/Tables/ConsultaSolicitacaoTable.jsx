import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';

const SolicitacaoTable = ({ solicitacoes, loading, page, size, totalElements, onChangePage, onChangeRowsPerPage }) => {
  return (
    <Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Motorista</TableCell>
                <TableCell>Setor</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>KM Inicial</TableCell>
                <TableCell>KM Final</TableCell>
                <TableCell>Saída</TableCell>
                <TableCell>Chegada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitacoes.length > 0 ? (
                solicitacoes.map((solicitacao) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell>{solicitacao.id}</TableCell>
                    <TableCell>{solicitacao.dataSolicitacao}</TableCell>
                    <TableCell>{solicitacao.nomeDestino}</TableCell>
                    <TableCell>{solicitacao.status}</TableCell>
                    <TableCell>{solicitacao.placaCarro}</TableCell>
                    <TableCell>{solicitacao.nomeMotorista}</TableCell>
                    <TableCell>{solicitacao.nomeSetor}</TableCell>
                    <TableCell>{solicitacao.nomeUsuario}</TableCell>
                    <TableCell>{solicitacao.kmInicial}</TableCell>
                    <TableCell>{solicitacao.kmFinal}</TableCell>
                    <TableCell>{solicitacao.horaSaida}</TableCell>
                    <TableCell>{solicitacao.horaChegada}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    Nenhuma solicitação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalElements ?? 0}
            page={page ?? 0}
            onPageChange={onChangePage}
            rowsPerPage={size ?? 10}
            onRowsPerPageChange={onChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Linhas por página:" // ✅ aqui a tradução
          />
        </>
      )}
    </Paper>
  );
};

export default SolicitacaoTable;
