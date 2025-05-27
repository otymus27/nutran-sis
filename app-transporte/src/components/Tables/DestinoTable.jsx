import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DestinoTable = ({ destinos, onEdit, onDelete, currentPage, totalPages, onPageChange, isAdmin }) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {destinos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Nenhum destino encontrado.
              </TableCell>
            </TableRow>
          ) : (
            destinos.map((destino) => (
              <TableRow key={destino.id} hover>
                <TableCell>{destino.id}</TableCell>
                <TableCell>{destino.nome}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(destino)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(destino.id)}>
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

export default DestinoTable;
