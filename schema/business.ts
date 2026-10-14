import { z } from "zod";

// Prisma Business.address is Json — this schema is the single source of truth
// for its shape. Required by Business.name/email/address, optional phone/taxId.
export const AddressSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .min(1, "Address line 1 is required")
    .max(255),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

// HTML inputs submit "" for untouched optional fields — the form normalizes
// "" to undefined before calling the server action, so Prisma stores NULL.
const optionalText = (max: number) => z.string().trim().max(max).optional();

export const BusinessSchema = z.object({
  // Prisma Business.name: String (required)
  name: z.string().trim().min(1, "Business name is required").max(255),

  // Prisma Business.email: String (required)
  email: z.email("Invalid business email address").trim().max(255),

  // Prisma Business.phone: String? (optional)
  phone: optionalText(20),

  // Prisma Business.taxId: String? (optional)
  taxId: optionalText(50),

  // Prisma Business.address: Json (required)
  address: AddressSchema,
});

export const CreateBusinessSchema = BusinessSchema;
export const UpdateBusinessSchema = BusinessSchema.partial();

export const BusinessRecordSchema = BusinessSchema.extend({
  id: z.uuid(),
});

export type BusinessSchema = z.infer<typeof BusinessSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type CreateBusinessInput = z.infer<typeof CreateBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof UpdateBusinessSchema>;
export type BusinessRecord = z.infer<typeof BusinessRecordSchema>;
