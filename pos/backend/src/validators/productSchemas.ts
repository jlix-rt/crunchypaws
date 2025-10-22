import { z } from 'zod';

export const searchProductSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  barcode: z.string().optional(),
}).refine(data => data.sku || data.name || data.barcode, {
  message: 'Debe proporcionar al menos un criterio de búsqueda',
});

export const getProductPricesSchema = z.object({
  price_list_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});



