import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CarroTable = ({ carros, onEdit, onDelete, currentPage, totalPages, onPageChange, isAdmin }) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carros.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            carros.map((carro) => (
              <TableRow key={carro.id} hover>
                <TableCell>{carro.id}</TableCell>
                <TableCell>{carro.marca}</TableCell>
                <TableCell>{carro.modelo}</TableCell>
                <TableCell>{carro.placa}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(carro)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(carro.id)}>
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

export default CarroTable;
