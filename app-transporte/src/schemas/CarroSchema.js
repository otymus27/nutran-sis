import { z } from 'zod';

export const carroSchema = z.object({
  placa: z.string().min(7, 'A placa deve ter no mínimo 7 caracteres').max(7, 'A placa deve ter no máximo 7 caracteres'),
  marca: z.string().nonempty('Marca é obrigatória'),
  modelo: z.string().nonempty('Modelo é obrigatório'),
});
