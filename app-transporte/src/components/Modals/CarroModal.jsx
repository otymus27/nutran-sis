import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carroSchema } from '../../schemas/CarroSchema.js';
import { useEffect } from 'react';

const marcasDisponiveis = [
  'CHEVROLET',
  'FIAT',
  'FORD',
  'HONDA',
  'HYUNDAI',
  'KIA',
  'NISSAN',
  'PEUGEUT',
  'RENAULT',
  'TOYOTA',
  'VOLKSWAGEN',
];

const modelosDisponiveis = {
  CHEVROLET: ['ONIX', 'Cruze', 'S10', 'Tracker', 'SPIN', 'Astra', 'Agile', 'COBALT'],
  FIAT: ['AMBULANCIA', 'DOBLO', 'FURGÃO', 'PALIO', 'ARGO', 'TORO', 'MOBI', 'STRADA'],
  FORD: ['Ka', 'Fiesta', 'Focus'],
  HONDA: ['Civic', 'HR-V', 'Fit', 'City'],
  HYUNDAI: ['HB20', 'Creta', 'i30'],
  KIA: ['Seltos', 'Sportage', 'Picanto'],
  NISSAN: ['Versa', 'Kicks', 'Sentra'],
  PEUGEUT: ['208', '3008', '5008'],
  RENAULT: ['AMBULANCIA', 'SANDERO', 'CAPTUR', 'DUSTER', 'KWID', 'MASTER'],
  TOYOTA: ['Corolla', 'Hilux', 'Yaris', 'RAV4'],
  VOLKSWAGEN: ['Gol', 'Polo', 'T-Cross'],
};

const CarroModal = ({ open, onClose, selectedCarro, onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carroSchema),
    defaultValues: {
      placa: '',
      marca: '',
      modelo: '',
      ...selectedCarro,
    },
  });

  const marcaSelecionada = watch('marca');

  useEffect(() => {
    if (open) {
      reset({
        placa: selectedCarro?.placa || '',
        marca: selectedCarro?.marca || '',
        modelo: selectedCarro?.modelo || '',
      });
    }
  }, [open, selectedCarro, reset]);

  const modelosParaMarcaSelecionada = modelosDisponiveis[marcaSelecionada] || [];

  const onSubmit = (data) => {
    console.log('Dados enviados:', data); // deve conter placa, marca, modelo
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{selectedCarro ? 'Editar Carro' : 'Adicionar Novo Carro'}</DialogTitle>
        <DialogContent>
          {/* Campo de placa */}
          <TextField
            margin="dense"
            label="Placa"
            fullWidth
            variant="outlined"
            {...register('placa')}
            error={!!errors.placa}
            helperText={errors.placa?.message}
          />

          {/* Campo de marca */}
          <FormControl fullWidth margin="dense" error={!!errors.marca}>
            <InputLabel id="marca-label">Marca</InputLabel>
            <Controller
              name="marca"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="marca-label"
                  label="Marca"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Reseta o modelo quando a marca mudar
                    reset((prev) => ({ ...prev, modelo: '', marca: e.target.value }));
                  }}
                >
                  {marcasDisponiveis.map((marca) => (
                    <MenuItem key={marca} value={marca}>
                      {marca}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.marca?.message}</FormHelperText>
          </FormControl>

          {/* Campo de modelo */}
          <FormControl fullWidth margin="dense" error={!!errors.modelo} disabled={!marcaSelecionada}>
            <InputLabel id="modelo-label">Modelo</InputLabel>
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => (
                <Select labelId="modelo-label" label="Modelo" {...field} disabled={!marcaSelecionada}>
                  {modelosParaMarcaSelecionada.map((modelo) => (
                    <MenuItem key={modelo} value={modelo}>
                      {modelo}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.modelo?.message}</FormHelperText>
          </FormControl>
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

export default CarroModal;
