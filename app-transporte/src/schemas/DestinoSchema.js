import { z } from 'zod';

export const destinoSchema = z.object({
  nome: z.string().min(1, 'Nome do destino é obrigatório').max(20, 'Deve ter no máximo 20 caracteres'),
});
