// Truth first: the same invoice every other figure runs.
// Website redesign $2,400 + brand assets $860 + maintenance $300 = $3,560,
// tax 10% = $356, total $3,916, for Maya Rao, INV-2026-0042.
// The 5-stage machine below only ever reads these numbers.
export const CLIENT = { init: "MR", name: "Maya Rao", invoices: 8 };
export const ITEMS = [
  { label: "Website redesign", amount: 2400 },
  { label: "Brand assets ×20", amount: 860 },
  { label: "Maintenance", amount: 300 },
];
export const SUBTOTAL = 3560;
export const TAX_RATE = 10;
export const TAX = 356;
export const TOTAL = SUBTOTAL + TAX;
export const INVOICE_NO = "INV-2026-0042";

export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Stage boundaries on the run clock 0..1.
export const STAGE = { client: 0.2, items: 0.45, tax: 0.62, assemble: 0.76, print: 1 } as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => {
  const u = clamp01(t);
  return u * u * (3 - 2 * u);
};
export const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));

export type Phase = "idle" | "client" | "items" | "tax" | "assemble" | "print" | "done";

export function phaseOf(t: number): Phase {
  if (t <= 0) return "idle";
  if (t < STAGE.client) return "client";
  if (t < STAGE.items) return "items";
  if (t < STAGE.tax) return "tax";
  if (t < STAGE.assemble) return "assemble";
  if (t < 1) return "print";
  return "done";
}

export function readoutOf(t: number): string {
  const pct = `${Math.round(t * 100)}%`;
  switch (phaseOf(t)) {
    case "idle":
      return `READY · ${INVOICE_NO} · ${money(TOTAL)}`;
    case "client":
      return `READING CLIENT · ${CLIENT.name} · ${pct}`;
    case "items":
      return `ADDING 3 ITEMS · ${money(SUBTOTAL)} · ${pct}`;
    case "tax":
      return `TAX ${TAX_RATE}% · +${money(TAX)} · ${pct}`;
    case "assemble":
      return `ASSEMBLING · ${money(TOTAL)} · ${pct}`;
    case "print":
      return `PRINTING · ${INVOICE_NO} · ${pct}`;
    case "done":
      return `PAID · ${INVOICE_NO} · ${money(TOTAL)}`;
  }
}

export function spokenOf(t: number): string {
  switch (phaseOf(t)) {
    case "idle":
      return "Ready. Press Generate to build invoice INV-2026-0042.";
    case "client":
      return `Stage 1 of 5: reading client ${CLIENT.name}.`;
    case "items":
      return "Stage 2 of 5: adding 3 line items, subtotal $3,560.";
    case "tax":
      return "Stage 3 of 5: tax dial locking at 10 percent, plus $356.";
    case "assemble":
      return "Stage 4 of 5: assembling the invoice, total $3,916.";
    case "print":
      return "Stage 5 of 5: printing invoice INV-2026-0042.";
    case "done":
      return "Done. Invoice INV-2026-0042 complete, $3,916.";
  }
}
