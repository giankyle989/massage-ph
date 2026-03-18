import { z } from 'zod';

export const ServiceSchema = z
  .object({
    name: z.string().min(1, 'Service name is required'),
    price: z.number().positive('Price must be positive'),
    duration: z.number().int().positive('Duration must be a positive integer'),
    discount: z.number().positive().nullable().optional(),
    discountType: z.enum(['percentage', 'fixed']).nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.discount && !data.discountType) return false;
      if (data.discountType && !data.discount) return false;
      return true;
    },
    { message: 'Discount requires both amount and type' }
  );

export const ListingCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  region: z.string().min(1, 'Region is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  services: z.array(ServiceSchema).min(1, 'At least one service is required'),
  isActive: z.boolean().optional().default(true),
});

export const ListingUpdateSchema = ListingCreateSchema;

export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;
export type ListingUpdateInput = z.infer<typeof ListingUpdateSchema>;
export type ServiceInput = z.infer<typeof ServiceSchema>;
