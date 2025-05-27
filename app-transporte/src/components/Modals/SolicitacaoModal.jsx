import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solicitacaoSchema } from '../../schemas/SolicitacaoSchema';

const SolicitacaoModal = ({
  open,
  onClose,
  selectedSolicitacao,
  onSave,
  isLoading,
  motoristas = [],
  setores = [],
  carros = [],
  destinos = [],
}) => {
  const isEditMode = Boolean(selectedSolicitacao);
  const dataAtual = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      idMotorista: '',
      idSetor: '',
      idCarro: '',
      idDestino: '',
      dataSolicitacao: dataAtual,
      status: 'PENDENTE',
      horaSaida: '',
      kmInicial: '',
      horaChegada: '',
      kmFinal: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        idMotorista: selectedSolicitacao?.idMotorista || '',
        idSetor: selectedSolicitacao?.idSetor || '',
        idCarro: selectedSolicitacao?.idCarro || '',
        idDestino: selectedSolicitacao?.idDestino || '',
        dataSolicitacao: selectedSolicitacao?.dataSolicitacao || dataAtual,
        status: selectedSolicitacao?.status || 'PENDENTE',
        horaSaida: selectedSolicitacao?.horaSaida || '',
        kmInicial: selectedSolicitacao?.kmInicial || '',
        horaChegada: selectedSolicitacao?.horaChegada || '',
        kmFinal: selectedSolicitacao?.kmFinal || '',
      });
    }
  }, [open, selectedSolicitacao, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{isEditMode ? 'Editar Solicitação' : 'Nova Solicitação'}</DialogTitle>
        <DialogContent>
          {/* Motorista */}
          <Controller
            name="idMotorista"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.idMotorista} required>
                <InputLabel id="motorista-label">Motorista</InputLabel>
                <Select {...field} labelId="motorista-label" label="Motorista">
                  <MenuItem value="">Selecione o motorista</MenuItem>
                  {motoristas.map(({ id, nome }) => (
                    <MenuItem key={id} value={id}>
                      {nome}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.idMotorista?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* Setor */}
          <Controller
            name="idSetor"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.idSetor} required>
                <InputLabel id="setor-label">Setor</InputLabel>
                <Select {...field} labelId="setor-label" label="Setor">
                  <MenuItem value="">Selecione o setor</MenuItem>
                  {setores.map(({ id, nome }) => (
                    <MenuItem key={id} value={id}>
                      {nome}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.idSetor?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* Destino */}
          <Controller
            name="idDestino"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.idDestino} required>
                <InputLabel id="destino-label">Destino</InputLabel>
                <Select {...field} labelId="destino-label" label="Destino">
                  <MenuItem value="">Selecione o destino</MenuItem>
                  {destinos.map(({ id, nome }) => (
                    <MenuItem key={id} value={id}>
                      {nome}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.idDestino?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* Carro */}
          <Controller
            name="idCarro"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.idCarro} required>
                <InputLabel id="carro-label">Carro</InputLabel>
                <Select {...field} labelId="carro-label" label="Carro">
                  <MenuItem value="">Selecione o carro</MenuItem>
                  {carros.map(({ id, marca, modelo, placa }) => (
                    <MenuItem key={id} value={id}>
                      {`${marca} ${modelo} (${placa})`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.idCarro?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* Data da Solicitação */}
          <Controller
            name="dataSolicitacao"
            control={control}
            render={({ field }) => (
              <TextField
                label="Data da Solicitação"
                type="date"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.dataSolicitacao}
                helperText={errors.dataSolicitacao?.message}
              />
            )}
          />

          {/* Status (apenas edição) */}
          {isEditMode && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select {...field} labelId="status-label" label="Status">
                    <MenuItem value="PENDENTE">PENDENTE</MenuItem>
                    <MenuItem value="CONCLUIDA">CONCLUIDA</MenuItem>
                    <MenuItem value="RECUSADA">RECUSADA</MenuItem>
                    <MenuItem value="CANCELADA">CANCELADA</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          )}

          {/* Horário da saída */}
          <Controller
            name="horaSaida"
            control={control}
            render={({ field }) => (
              <TextField
                label="Horário da saída"
                type="time"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.horaSaida}
                helperText={errors.horaSaida?.message}
              />
            )}
          />

          {/* KM Inicial */}
          <Controller
            name="kmInicial"
            control={control}
            render={({ field }) => (
              <TextField
                label="KM Inicial"
                type="number"
                fullWidth
                margin="dense"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                value={field.value || ''}
                error={!!errors.kmInicial}
                helperText={errors.kmInicial?.message}
              />
            )}
          />

          {/* Horário da chegada */}
          <Controller
            name="horaChegada"
            control={control}
            render={({ field }) => (
              <TextField
                label="Horário da chegada"
                type="time"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                {...field}
                error={!!errors.horaChegada}
                helperText={errors.horaChegada?.message}
              />
            )}
          />

          {/* KM Final */}
          <Controller
            name="kmFinal"
            control={control}
            render={({ field }) => (
              <TextField
                label="KM Final"
                type="number"
                fullWidth
                margin="dense"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                value={field.value || ''}
                error={!!errors.kmFinal}
                helperText={errors.kmFinal?.message}
              />
            )}
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

export default SolicitacaoModal;
