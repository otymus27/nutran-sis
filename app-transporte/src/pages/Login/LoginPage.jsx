import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FaUser, FaLock } from 'react-icons/fa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Substitua pelo seu logo local ou remoto
const logoUrl =
  'https://www.saude.df.gov.br/documents/37101/0/Logo+SESDF+-+Vers%C3%A3o+Horizontal+v1+%282%29.png/349cd382-761d-c647-5199-0f77cff690e5?t=1727180366655';
const backgroundImage = '/ambulancia.jpg';

const LoginPage = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [localError, setLocalError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLocalLoading(true);

    if (!loginInput.trim()) {
      setLocalError('Por favor, insira o seu nome de utilizador.');
      setLocalLoading(false);
      return;
    }
    if (!senha.trim()) {
      setLocalError('Por favor, insira a sua senha.');
      setLocalLoading(false);
      return;
    }

    try {
      await login(loginInput, senha);
      navigate('/home');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        position: 'relative',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'white',
          p: 4,
          borderRadius: 4,
          boxShadow: 5,
          zIndex: 2,
        }}
        component="form"
        onSubmit={handleLogin}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={2}>
          <img src={logoUrl} alt="Logo" style={{ height: 60 }} />
        </Box>

        {/* Título */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h6" color="textPrimary" fontWeight={600}>
            Bem-vindo ao Sistema de Gestão de Solicitações
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Faça login para continuar
          </Typography>
        </Box>

        {/* Ícone */}
        <Box textAlign="center" mb={2}>
          <Avatar sx={{ m: '0 auto', bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>

        {/* Erro */}
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {/* Campos */}
        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="login">Login</InputLabel>
          <Input
            id="login"
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FaUser />
              </InputAdornment>
            }
            placeholder="Digite seu nome de utilizador"
          />
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="senha">Senha</InputLabel>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FaLock />
              </InputAdornment>
            }
            placeholder="Digite sua senha"
          />
        </FormControl>

        {/* Botão */}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={localLoading}>
          {localLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
