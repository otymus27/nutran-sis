import { z } from 'zod';

export const setorSchema = z.object({
  nome: z.string().min(1, 'Nome do setor é obrigatório').max(20, 'Deve ter no máximo 20 caracteres'),
});
