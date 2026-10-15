// Truth first: the invoice status pipeline.
// Counts chosen so paid/(paid+overdue) = 15/16 ≈ 94% on-time,
// matching the landing-page stat. Amounts are illustrative but fixed:
// every readout below comes from these numbers, never typed twice.
export const STATUSES = ["draft", "sent", "paid", "overdue"] as const;
export type StatusIndex = 0 | 1 | 2 | 3;

export const COUNTS: Record<(typeof STATUSES)[number], number> = {
  draft: 2,
  sent: 3,
  paid: 15,
  overdue: 1,
};

export const AMOUNTS: Record<(typeof STATUSES)[number], number> = {
  draft: 3180,
  sent: 4740,
  paid: 52130,
  overdue: 975,
};

export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const readoutOf = (index: number) => {
  const s = STATUSES[Math.round(index) % 4]!;
  return `${s.toUpperCase()} · ${COUNTS[s]} invoices · ${money(AMOUNTS[s])}`;
};

export const spokenOf = (index: number) => {
  const s = STATUSES[Math.round(index) % 4]!;
  return `${s}, ${COUNTS[s]} invoices totalling ${money(AMOUNTS[s])}`;
};
