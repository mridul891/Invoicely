// Truth first: how tax reshapes an invoice.
// Subtotal is the landing-page $3,560. The crank offers the four rates an
// Indian freelancer actually meets: 0, 5, 10, 18%. The two bars show where
// every $100 of the total goes — client share vs tax share — so their
// heights always add to the same full bar. Readouts print exact money.
export const SUBTOTAL = 3560;
export const RATES = [0, 5, 10, 18] as const;

export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const taxOf = (rate: number) => (SUBTOTAL * rate) / 100;
export const totalOf = (rate: number) => SUBTOTAL + taxOf(rate);
// Bar heights in world units: full bar = 22 (every $100 of the total).
export const BAR_FULL = 22;
export const subBarH = (rate: number) => (SUBTOTAL / totalOf(rate)) * BAR_FULL;
export const taxBarH = (rate: number) => (taxOf(rate) / totalOf(rate)) * BAR_FULL;

export const readoutOf = (rate: number) =>
  `TAX ${rate}% · tax ${money(taxOf(rate))} · total ${money(totalOf(rate))}`;

export const spokenOf = (rate: number) =>
  `Tax rate ${rate} percent. Tax ${money(taxOf(rate))}, total ${money(totalOf(rate))} on a ${money(SUBTOTAL)} subtotal.`;
