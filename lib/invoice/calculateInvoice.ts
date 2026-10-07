import { InvoiceItem, InvoiceTax } from "@/schema/invoice";

enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateInvoiceItem(item: InvoiceItem) {
  const total = roundMoney(item.quantity * item.unitPrice);

  return {
    ...item,
    total,
  };
}

function calculateSubtotal(items: InvoiceItem[]) {
  const subtotal = items.reduce((total, item) => {
    return total + roundMoney(item.quantity * item.unitPrice);
  }, 0);

  return roundMoney(subtotal);
}

function calculateInvoiceLevelDiscount(
  subtotal: number,
  discountValue: number,
  discountType: DiscountType,
) {
  if (discountValue <= 0) {
    return 0;
  }

  if (discountType === DiscountType.PERCENTAGE) {
    const percentage = Math.min(discountValue, 100);

    return roundMoney((subtotal * percentage) / 100);
  }

  return roundMoney(Math.min(discountValue, subtotal));
}

function calculateTaxAmount(tax: InvoiceTax, taxableAmount: number) {
  const amount = roundMoney((taxableAmount * tax.rate) / 100);

  return {
    name: tax.name,
    rate: tax.rate,
    amount,
  };
}

function calculateInvoiceTotal(
  items: InvoiceItem[],
  taxes: InvoiceTax[],
  discountValue: number,
  discountType: DiscountType = DiscountType.FIXED,
) {
  const itemsWithTotal = items.map(calculateInvoiceItem);

  const subtotal = calculateSubtotal(items);

  const discountAmount = calculateInvoiceLevelDiscount(
    subtotal,
    discountValue,
    discountType,
  );

  const taxableAmount = roundMoney(subtotal - discountAmount);

  const calculatedTaxes = taxes.map((tax) =>
    calculateTaxAmount(tax, taxableAmount),
  );

  const taxTotal = roundMoney(
    calculatedTaxes.reduce((total, tax) => {
      return total + tax.amount;
    }, 0),
  );

  const total = roundMoney(taxableAmount + taxTotal);

  return {
    items: itemsWithTotal,

    subtotal,

    discountType,
    discountValue,
    discountAmount,

    taxableAmount,

    taxes: calculatedTaxes,
    taxTotal,

    total,
  };
}

export {
  DiscountType,
  roundMoney,
  calculateInvoiceItem,
  calculateSubtotal,
  calculateInvoiceLevelDiscount,
  calculateTaxAmount,
  calculateInvoiceTotal,
};