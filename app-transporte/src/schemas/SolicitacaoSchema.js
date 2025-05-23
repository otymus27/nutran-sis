import { z } from 'zod';

export const solicitacaoSchema = z.object({
  idMotorista: z.number({
    required_error: 'Motorista é obrigatório',
    invalid_type_error: 'Motorista inválido',
  }),
  idSetor: z.number({
    required_error: 'Setor é obrigatório',
    invalid_type_error: 'Setor inválido',
  }),

  idCarro: z.number({
    required_error: 'Carro é obrigatório',
    invalid_type_error: 'Carro inválido',
  }),

  destino: z.string().nonempty('Destino é obrigatório'),
  dataSolicitacao: z.string().nonempty('Data é obrigatória'),
  status: z.string().optional(),
  horaSaida: z.string().nonempty('Hora de saída é obrigatória'),

  kmInicial: z.number({
    required_error: 'kmInicial é obrigatório',
    invalid_type_error: 'kmInicial inválido!!!',
  }),
  horaChegada: z.string().nonempty('Hora de chegada é obrigatória'),

  kmFinal: z.number({
    required_error: 'kmFinal é obrigatório',
    invalid_type_error: 'kmFinal inválido!!!',
  }),
});
