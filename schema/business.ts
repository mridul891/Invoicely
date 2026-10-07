import { z } from "zod";

export const AddressSchema = z.object({
    addressLine1: z.string().max(255),
    city: z.string().max(100),
    state: z.string().max(100),
    postalCode: z.string().max(20),
    country: z.string().max(100),
});

export const BusinessSchema = z.object({
  id: z.uuid(),
  name: z.string().max(255),
  email: z.email(),
  phone: z.string().max(20).optional(),
  taxId : z.string().max(50).optional(),
  address: AddressSchema,
});





export type Business = z.infer<typeof BusinessSchema>;
export type Address = z.infer<typeof AddressSchema>;