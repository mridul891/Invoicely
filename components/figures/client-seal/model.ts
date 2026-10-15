// Truth first: the client book. Three real-feeling clients with the invoice
// counts the landing page quotes (12 / 8 / 5), stamped under one business
// profile: Acme Studio Pvt. Ltd., GSTIN 22AAAAA0000A1Z5, Bengaluru. The seal
// always imprints the same header — set up once, stamped forever.
export const CLIENTS = [
  { init: "AS", name: "Acme Studio", invoices: 12 },
  { init: "MR", name: "Maya Rao", invoices: 8 },
  { init: "JK", name: "Juno & Co.", invoices: 5 },
] as const;

export const BUSINESS_NAME = "Acme Studio Pvt. Ltd.";
export const GSTIN = "22AAAAA0000A1Z5";

export const readoutOf = (index: number, pressing: boolean) => {
  const c = CLIENTS[Math.max(0, Math.min(2, Math.round(index)))]!;
  const what = `${c.name} · ${c.invoices} invoices`;
  if (pressing) return `STAMPING · ${what}`;
  return `SEALED · ${what} · ${GSTIN}`;
};

export const spokenOf = (index: number) => {
  const c = CLIENTS[Math.max(0, Math.min(2, Math.round(index)))]!;
  return `${c.name}, ${c.invoices} invoices, sealed under GSTIN ${GSTIN}`;
};
