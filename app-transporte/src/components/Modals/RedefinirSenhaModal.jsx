import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { confirmarRedefinicao } from '../../services/UsuarioService.js';
import { useNavigate } from 'react-router-dom';

const schema = z
  .object({
    id: z.number({ invalid_type_error: 'ID deve ser um número' }).positive('ID deve ser positivo'),
    senhaProvisoria: z.string().min(1, 'Senha provisória é obrigatória'),
    novaSenha: z.string().min(3, 'Nova senha deve ter no mínimo 3 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

const RedefinirSenhaModal = ({ open, onClose, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      id: userId || '',
      senhaProvisoria: '',
      novaSenha: '',
      confirmarSenha: '',
    },
  });

  useEffect(() => {
    setValue('id', userId || '');
  }, [userId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const idNum = Number(data.id);
      await confirmarRedefinicao({
        id: idNum,
        senhaProvisoria: data.senhaProvisoria,
        novaSenha: data.novaSenha,
      });

      setSnackbar({
        open: true,
        message: 'Senha redefinida com sucesso! Faça login com a nova senha.',
        severity: 'success',
      });

      reset();

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      const msg = error?.response?.data?.mensagem || error?.message || 'Erro ao redefinir a senha. Tente novamente.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    reset();
    if (onClose) onClose(); // ✅ Fechar o modal
    navigate('/'); // ✅ Redirecionar para login
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} disableEscapeKeyDown>
        <DialogTitle>Redefinir Senha</DialogTitle>
        <DialogContent>
          <Typography mb={2}>Por segurança, é necessário redefinir sua senha.</Typography>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="ID do Usuário"
              type="number"
              fullWidth
              margin="normal"
              {...register('id', { valueAsNumber: true })}
              error={!!errors.id}
              helperText={errors.id?.message}
              disabled={loading || !!userId}
            />
            <TextField
              label="Senha Provisória"
              type="password"
              fullWidth
              margin="normal"
              {...register('senhaProvisoria')}
              error={!!errors.senhaProvisoria}
              helperText={errors.senhaProvisoria?.message}
              disabled={loading}
            />
            <TextField
              label="Nova Senha"
              type="password"
              fullWidth
              margin="normal"
              {...register('novaSenha')}
              error={!!errors.novaSenha}
              helperText={errors.novaSenha?.message}
              disabled={loading}
            />
            <TextField
              label="Confirmar Nova Senha"
              type="password"
              fullWidth
              margin="normal"
              {...register('confirmarSenha')}
              error={!!errors.confirmarSenha}
              helperText={errors.confirmarSenha?.message}
              disabled={loading}
            />

            <DialogActions sx={{ justifyContent: 'center' }}>
              <Stack direction="row" spacing={2}>
                <Button onClick={handleCancel} variant="outlined" color="secondary" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RedefinirSenhaModal;
