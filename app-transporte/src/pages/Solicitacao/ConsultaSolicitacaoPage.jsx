import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Button, Grid, Paper, Typography, MenuItem, Alert, Stack } from '@mui/material';
import SolicitacaoTable from '../../components/Tables/ConsultaSolicitacaoTable.jsx';
import { getMotoristas } from '../../services/MotoristaService.js';
import { getDestinos } from '../../services/DestinoService.js';
import { getSetores } from '../../services/SetorService.js';
import { getCarros } from '../../services/CarroService.js';
import { consultarSolicitacoes } from '../../services/SolicitacaoService.js';
import useAuth from '../../hooks/useAuth.jsx';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';

import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import GerarRelatorioSolicitacoes from '../../components/Relatorios/ConsultaSolicitacaoRelatorio.jsx';

const ConsultaSolicitacoesPage = () => {
  const { user } = useAuth();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      motoristaId: '',
      destinoId: '',
      setorId: '',
      carroId: '',
      dataInicio: '',
      dataFim: '',
    },
  });

  const [filtros, setFiltros] = useState({});
  const [motoristas, setMotoristas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    getMotoristas().then(setMotoristas);
    getDestinos().then(setDestinos);
    getSetores().then(setSetores);
    getCarros().then(setCarros);
  }, []);

  const onSubmit = async (data) => {
    setFiltros(data);
    setLoading(true);
    try {
      const response = await consultarSolicitacoes(data, filtros, size);
      setSolicitacoes(response?.content || []);
      setTotalElements(response?.totalElements ?? 0);
    } catch (error) {
      console.error('Erro ao consultar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSubmit();
  }, [filtros, page, size]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0); // Sempre voltar para a primeira página ao mudar tamanho
  };

  const handleReset = () => {
    reset();
    setFiltros({});
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Erro ao carregar dados do usuário. Por favor, faça login novamente.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <CustomHeader />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" spacing={2} mb={2} justifyContent="center">
            <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleSubmit(onSubmit)}>
              Buscar
            </Button>

            <Button variant="outlined" color="secondary" startIcon={<ClearIcon />} onClick={handleReset}>
              Limpar
            </Button>

            <GerarRelatorioSolicitacoes solicitacoes={solicitacoes} loading={loading} startIcon={<DescriptionIcon />} />
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Consulta de Solicitações
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="motoristaId"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Motorista" select fullWidth>
                        <MenuItem value="">Todos</MenuItem>
                        {motoristas.map((motorista) => (
                          <MenuItem key={motorista.id} value={motorista.id}>
                            {motorista.nome}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="carroId"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Carro" select fullWidth>
                        <MenuItem value="">Todos</MenuItem>
                        {carros.map((carro) => (
                          <MenuItem key={carro.id} value={carro.id}>
                            {carro.placa}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="destinoId"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Destino" select fullWidth>
                        <MenuItem value="">Todos</MenuItem>
                        {destinos.map((destino) => (
                          <MenuItem key={destino.id} value={destino.id}>
                            {destino.nome}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="setorId"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Setor" select fullWidth>
                        <MenuItem value="">Todos</MenuItem>
                        {setores.map((setor) => (
                          <MenuItem key={setor.id} value={setor.id}>
                            {setor.nome}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="dataInicio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Data Início"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Controller
                    name="dataFim"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Data Fim" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                    )}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <Stack direction="row" spacing={2} mt={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Search />}
                      sx={{ borderRadius: 2 }}
                    >
                      Buscar
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      startIcon={<Refresh />}
                      onClick={handleReset}
                      sx={{ borderRadius: 2 }}
                    >
                      Limpar
                    </Button>

                    <GerarRelatorioSolicitacoes solicitacoes={solicitacoes} loading={loading} />
                  </Stack>
                </Grid> */}
              </Grid>
            </form>

            <SolicitacaoTable
              solicitacoes={solicitacoes}
              loading={loading}
              page={page}
              size={size}
              totalElements={totalElements}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default ConsultaSolicitacoesPage;
