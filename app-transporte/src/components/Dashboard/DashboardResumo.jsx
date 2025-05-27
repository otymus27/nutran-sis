import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { getDashboard } from '../../services/DashboardService.js'; // Ajuste o caminho conforme necessário

const DashboardResumo = () => {
  const [dashboardData, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const renderCard = (title, value, Icon, color) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Icon sx={{ fontSize: 40, mr: 2, color }} />
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </Paper>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderCard('Carros', dashboardData.totalCarros, DirectionsCarIcon, 'blue')}
        {renderCard('Motoristas', dashboardData.totalMotoristas, PeopleIcon, 'green')}
        {renderCard('Setores', dashboardData.totalSetores, ApartmentIcon, 'purple')}
        {renderCard('Solicitações', dashboardData.totalSolicitacoes, ListAltIcon, 'orange')}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Últimas Solicitações
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Motorista</TableCell>
              <TableCell>Carro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardData.ultimasSolicitacoes.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.id.destino}</TableCell>
                <TableCell>{s.dataSolicitacao}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>{s.nomeMotorista}</TableCell>
                <TableCell>{s.placaCarro}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardResumo;
