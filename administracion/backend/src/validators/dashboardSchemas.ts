import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});



