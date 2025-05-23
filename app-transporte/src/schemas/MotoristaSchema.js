import { z } from 'zod';

export const motoristaSchema = z.object({
  nome: z.string().min(10, 'Nome completo é obrigatório'),
  matricula: z
    .string()
    .min(7, 'A matricula deve ter no mínimo 7 caracteres')
    .max(7, 'A matricula deve ter no máximo 8 caracteres'),
  telefone: z
    .string()
    .min(8, 'O telefone deve ter no máximo 8 caracteres')
    .max(14, 'Telefone deve ter no máximo 12 caracteres'),
});
