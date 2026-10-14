import type { Prisma } from "@/app/generated/prisma/client";
import type { Client } from "@/schema/client";

type TransactionClient = Prisma.TransactionClient;

type ResolveInvoiceClient = {
  businessId: string;
  clientId?: string;
  client?: Client;
};

export async function resolveInvoiceClient(
  tx: TransactionClient,
  { businessId, clientId, client }: ResolveInvoiceClient,
) {
  if (clientId && client) {
    throw new Error("Provide either clientId or client details, not both");
  }

  if (clientId) {
    const existingClient = await tx.client.findFirst({
      where: {
        id: clientId,
        businessId: businessId,
      },
    });

    if (!existingClient) {
      throw new Error("Client not found");
    }
    return existingClient;
  }

  if (!client) {
    throw new Error("Client information is required");
  }
  
  const newClient = await tx.client.create({
    data: {
      name: client.name,
      email: client?.email ?? undefined,
      phone: client?.phone ?? undefined,
      taxId: client?.taxId ?? undefined,
      address: client.address,
      businessId: businessId,
    },
  });
  return newClient;
}
