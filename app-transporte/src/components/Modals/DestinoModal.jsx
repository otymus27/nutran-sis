import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { destinoSchema } from '../../schemas/DestinoSchema';

const DestinoModal = ({ open, onClose, selectedDestino, onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(destinoSchema),
    defaultValues: {
      id: '',
      nome: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: selectedDestino?.id || '',
        nome: selectedDestino?.nome || '',
      });
    }
  }, [open, selectedDestino, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{selectedDestino ? 'Editar Destino' : 'Adicionar Novo Destino'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            fullWidth
            variant="outlined"
            {...register('id')}
            error={!!errors.id}
            helperText={errors.id?.message}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            {...register('nome')}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DestinoModal;
