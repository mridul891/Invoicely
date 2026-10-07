import {z} from "zod";
import { AddressSchema } from "./business";

export const ClientSchema = z.object({
    name: z.string().max(255),
    email: z.email().optional(),
    phone: z.string().max(20).optional(),
    taxId : z.string().max(50).optional(),
    address: AddressSchema
});

export type Client = z.infer<typeof ClientSchema>;
