import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motoristaSchema } from '../../schemas/MotoristaSchema';

const MotoristaModal = ({ open, onClose, selectedMotorista, onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motoristaSchema),
    defaultValues: {
      nome: '',
      matricula: '',
      telefone: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: selectedMotorista?.nome || '',
        matricula: selectedMotorista?.matricula || '',
        telefone: selectedMotorista?.telefone || '',
      });
    }
  }, [open, selectedMotorista, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{selectedMotorista ? 'Editar Motorista' : 'Adicionar Novo Motorista'}</DialogTitle>
        <DialogContent>
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

          <TextField
            margin="dense"
            label="Matrícula"
            fullWidth
            variant="outlined"
            {...register('matricula')}
            error={!!errors.matricula}
            helperText={errors.matricula?.message}
          />

          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            variant="outlined"
            {...register('telefone')}
            error={!!errors.telefone}
            helperText={errors.telefone?.message}
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

export default MotoristaModal;
