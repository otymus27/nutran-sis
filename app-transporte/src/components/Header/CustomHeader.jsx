import { Avatar, Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const CustomHeader = () => {
  const { user,logout } = useAuth();
  console.log('CustomHeader user:', user); // Log de depuração
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main' }}>
      <Typography variant="h6" sx={{ color: 'white' }}>
        SISTRAN - Sistema de Gestão de Transporte
      </Typography>
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{(user.nome || user.name || user.login || 'U').substring(0, 2).toUpperCase()}</Avatar>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {`Bem-vindo, ${user.login} - ${Array.isArray(user.roles) ? user.roles[0]?.nome : user.role}`}
          </Typography>
          <Button variant="contained" color="secondary" onClick={logout}>
            Sair
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomHeader;