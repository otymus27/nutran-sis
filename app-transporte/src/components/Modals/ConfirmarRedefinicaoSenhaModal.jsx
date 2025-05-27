import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';

const ConfirmarRedefinicaoSenhaModal = ({ open, onClose, formData, onFormChange, onConfirm, isLoading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Redefinição de Senha</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="login"
          label="Login"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.login}
          onChange={(e) => onFormChange('login', e.target.value)}
          required
        />
        <TextField
          margin="dense"
          name="senhaProvisoria"
          label="Senha Provisória"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.senhaProvisoria}
          onChange={(e) => onFormChange('senhaProvisoria', e.target.value)}
          required
        />
        <TextField
          margin="dense"
          name="novaSenha"
          label="Nova Senha"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.novaSenha}
          onChange={(e) => onFormChange('novaSenha', e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmarRedefinicaoSenhaModal;
