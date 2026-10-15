// Truth first: the invoice lifecycle this press explains.
// Same numbers as the landing page: $2,400 + $860 + $300 = $3,560,
// tax 10% = $356, total $3,916. Avg 6 days to paid, 94% on time.
export interface PressState {
  sent: { at: number; rate: number };
  paid: { at: number; rate: number };
}

export const SUBTOTAL = 2400 + 860 + 300; // 3560
export const TAX = 356;
export const TOTAL = SUBTOTAL + TAX; // 3916
export const DAYS_TO_PAID = 6;
export const ON_TIME = 94;
export const DIAL_SPAN = 14; // dial reads 0..14 days

export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const stateAt = (): PressState => ({
  sent: { at: 0, rate: 0 },
  paid: { at: 0, rate: 0 },
});

export type Phase = "draft" | "sending" | "sent" | "paying" | "paid";

export function phaseOf(s: PressState): Phase {
  if (s.paid.at > 0.98) return "paid";
  if (s.paid.at > 0.02 || s.paid.rate !== 0) return "paying";
  if (s.sent.at > 0.98) return "sent";
  if (s.sent.at > 0.02 || s.sent.rate !== 0) return "sending";
  return "draft";
}

export function readoutOf(s: PressState): string {
  const p = phaseOf(s);
  if (p === "paid") return `PAID in ${DAYS_TO_PAID}d · ${money(TOTAL)}`;
  if (p === "paying") return `paying… · ${money(TOTAL * s.paid.at)} of ${money(TOTAL)}`;
  if (p === "sent") return `SENT · awaiting ${money(TOTAL)}`;
  if (p === "sending") return `stamping… · ${money(TOTAL)}`;
  return `DRAFT · ${money(TOTAL)} due`;
}

export function spokenOf(s: PressState): string {
  const p = phaseOf(s);
  if (p === "paid") return `Paid: ${money(TOTAL)} received in ${DAYS_TO_PAID} days`;
  if (p === "sent") return `Sent: invoice for ${money(TOTAL)} awaiting payment`;
  return `Draft: invoice for ${money(TOTAL)} not yet sent`;
}

// Dial needle angle: 0 days points straight up (-90°), 14 days full circle.
export const needleAngle = (s: PressState) =>
  -Math.PI / 2 + (Math.min(DAYS_TO_PAID, DIAL_SPAN) / DIAL_SPAN) * Math.PI * 2 * Math.max(s.sent.at, 0.04);
