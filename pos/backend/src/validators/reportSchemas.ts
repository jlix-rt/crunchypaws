import { z } from 'zod';

export const reportQuerySchema = z.object({
  date: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  employee_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  format: z.enum(['json', 'csv', 'pdf']).optional().default('json'),
});



