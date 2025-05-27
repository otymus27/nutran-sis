import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';

const GerarSenhaProvisoriaModal = ({ open, onClose, formData, onFormChange, onGenerate, isLoading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Gerar Senha Provisória</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="login"
          label="Login do Usuário"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.login}
          onChange={(e) => onFormChange('login', e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Gerar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GerarSenhaProvisoriaModal;
