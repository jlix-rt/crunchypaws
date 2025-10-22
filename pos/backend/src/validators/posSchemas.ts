import { z } from 'zod';

export const openSessionSchema = z.object({
  opening_amount: z.number().min(0, 'El monto de apertura debe ser positivo'),
});

export const closeSessionSchema = z.object({
  closing_amount: z.number().min(0, 'El monto de cierre debe ser positivo'),
});

export const addDiscrepancySchema = z.object({
  amount: z.number().min(0, 'El monto debe ser positivo'),
  reason: z.string().min(1, 'La razón es requerida'),
});



