import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MotoristaTable = ({ motoristas, onEdit, onDelete, currentPage, totalPages, onPageChange, isAdmin }) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Matricula</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {motoristas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhum motorista encontrado.
              </TableCell>
            </TableRow>
          ) : (
            motoristas.map((motorista) => (
              <TableRow key={motorista.id} hover>
                <TableCell>{motorista.id}</TableCell>
                <TableCell>{motorista.matricula}</TableCell>
                <TableCell>{motorista.nome}</TableCell>
                <TableCell>{motorista.telefone}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(motorista)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(motorista.id)}>
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
          />
        </Box>
      )}
    </>
  );
};

export default MotoristaTable;
