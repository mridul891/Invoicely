import { z } from "zod";
import { ClientSchema } from "./client";

export const InvoiceItemSchema = z.object({
  description: z.string().max(255).min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be a positive number"),
  unitPrice: z.number().min(0, "Unit price must be a non-negative number"),
  hsnSac: z.string().trim().optional(),

});

export const InvoiceTaxSchema = z.object({
  name: z.string().max(100).min(1, "Tax name is required"),
  rate: z.number().min(0, "Tax rate must be a non-negative number"),
});

export const InvoicePayementDetailsSchema = z.object({
  accountName: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  ifscCode: z.string().trim().max(20).optional(),
  bankName: z.string().trim().max(100).optional(),
  upiId: z.string().trim().max(15).optional(),
});

export const invoiceFormSchema = z
  .object({
    // Existing client
    clientId: z.uuid().optional(),

    // New client
    client: ClientSchema.optional(),

    invoiceNumber: z.string().trim().min(1, "Invoice number is required"),

    currency: z.string().trim().min(1, "Currency is required").default("INR"),

    issuedAt: z.coerce.date(),

    dueDate: z.coerce.date().optional(),

    items: z
      .array(InvoiceItemSchema)
      .min(1, "At least one invoice item is required"),

    taxes: z.array(InvoiceTaxSchema).default([]),

    discountType: z.enum(["None", "Percentage", "Fixed"]).default("None"),

    discountValue: z.number().min(0, "Discount value cannot be negative").default(0),


    paymentDetails: InvoicePayementDetailsSchema.optional(),

    notes: z.string().trim().optional(),

    terms: z.string().trim().optional(),
  })

  // Exactly one of clientId or client must be supplied.
  .refine((data) => Boolean(data.clientId) !== Boolean(data.client), {
    message: "Select an existing client or enter a new client",
    path: ["clientId"],
  })

  // Due date cannot be earlier than issue date.
  .refine((data) => !data.dueDate || data.dueDate >= data.issuedAt, {
    message: "Due date cannot be before issue date",
    path: ["dueDate"],
  });


export type InvoicePayementDetails = z.infer<
  typeof InvoicePayementDetailsSchema
>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceTax = z.infer<typeof InvoiceTaxSchema>;
export type InvoiceForm = z.input<typeof invoiceFormSchema>;
export type InvoiceFormData = z.output<typeof invoiceFormSchema>;
