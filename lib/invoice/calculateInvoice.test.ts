import { describe, expect, it } from "vitest";

import {
  calculateInvoiceItem,
  calculateInvoiceLevelDiscount,
  calculateInvoiceTotal,
  calculateSubtotal,
  calculateTaxAmount,
  DiscountType,
} from "./calculateInvoice";

describe("Invoice calculations", () => {
  describe("calculateInvoiceItem", () => {
    it("calculates the total for a single item", () => {
      const item = {
        description: "Website Development",
        quantity: 2,
        unitPrice: 1000,
      };

      const result = calculateInvoiceItem(item);

      expect(result).toEqual({
        description: "Website Development",
        quantity: 2,
        unitPrice: 1000,
        total: 2000,
      });
    });

    it("supports decimal quantities", () => {
      const item = {
        description: "Consulting",
        quantity: 2.5,
        unitPrice: 1000,
      };

      const result = calculateInvoiceItem(item);

      expect(result.total).toBe(2500);
    });
  });

  describe("calculateSubtotal", () => {
    it("calculates the subtotal of multiple items", () => {
      const items = [
        {
          description: "Website Development",
          quantity: 2,
          unitPrice: 1000,
        },
        {
          description: "Hosting",
          quantity: 1,
          unitPrice: 3000,
        },
      ];

      const result = calculateSubtotal(items);

      expect(result).toBe(5000);
    });

    it("returns 0 when there are no items", () => {
      const result = calculateSubtotal([]);

      expect(result).toBe(0);
    });
  });

  describe("calculateInvoiceLevelDiscount", () => {
    it("calculates a percentage discount", () => {
      const result = calculateInvoiceLevelDiscount(
        5000,
        10,
        DiscountType.PERCENTAGE,
      );

      expect(result).toBe(500);
    });

    it("calculates a fixed discount", () => {
      const result = calculateInvoiceLevelDiscount(
        5000,
        1000,
        DiscountType.FIXED,
      );

      expect(result).toBe(1000);
    });

    it("does not allow percentage discount above 100%", () => {
      const result = calculateInvoiceLevelDiscount(
        5000,
        150,
        DiscountType.PERCENTAGE,
      );

      expect(result).toBe(5000);
    });

    it("does not allow fixed discount above the subtotal", () => {
      const result = calculateInvoiceLevelDiscount(
        5000,
        7000,
        DiscountType.FIXED,
      );

      expect(result).toBe(5000);
    });

    it("returns 0 when discount is 0", () => {
      const result = calculateInvoiceLevelDiscount(5000, 0, DiscountType.FIXED);

      expect(result).toBe(0);
    });
  });

  describe("calculateTaxAmount", () => {
    it("calculates tax from the taxable amount", () => {
      const tax = {
        name: "GST",
        rate: 18,
      };

      const result = calculateTaxAmount(tax, 5000);

      expect(result).toEqual({
        name: "GST",
        rate: 18,
        amount: 900,
      });
    });

    it("returns 0 tax when the taxable amount is 0", () => {
      const tax = {
        name: "GST",
        rate: 18,
      };

      const result = calculateTaxAmount(tax, 0);

      expect(result).toEqual({
        name: "GST",
        rate: 18,
        amount: 0,
      });
    });
  });

  describe("calculateInvoiceTotal", () => {
    it("calculates an invoice without discount or taxes", () => {
      const items = [
        {
          description: "Website Development",
          quantity: 2,
          unitPrice: 1000,
        },
        {
          description: "Hosting",
          quantity: 1,
          unitPrice: 3000,
        },
      ];

      const result = calculateInvoiceTotal(items, [], 0, DiscountType.FIXED);

      expect(result.subtotal).toBe(5000);
      expect(result.discountAmount).toBe(0);
      expect(result.taxableAmount).toBe(5000);
      expect(result.taxes).toEqual([]);
      expect(result.taxTotal).toBe(0);
      expect(result.total).toBe(5000);
    });

    it("calculates an invoice with a percentage discount", () => {
      const items = [
        {
          description: "Website Development",
          quantity: 1,
          unitPrice: 5000,
        },
      ];

      const result = calculateInvoiceTotal(
        items,
        [],
        10,
        DiscountType.PERCENTAGE,
      );

      expect(result.subtotal).toBe(5000);
      expect(result.discountType).toBe(DiscountType.PERCENTAGE);
      expect(result.discountValue).toBe(10);
      expect(result.discountAmount).toBe(500);
      expect(result.taxableAmount).toBe(4500);
      expect(result.taxTotal).toBe(0);
      expect(result.total).toBe(4500);
    });

    it("calculates an invoice with a fixed discount", () => {
      const items = [
        {
          description: "Website Development",
          quantity: 1,
          unitPrice: 5000,
        },
      ];

      const result = calculateInvoiceTotal(items, [], 1000, DiscountType.FIXED);

      expect(result.subtotal).toBe(5000);
      expect(result.discountType).toBe(DiscountType.FIXED);
      expect(result.discountValue).toBe(1000);
      expect(result.discountAmount).toBe(1000);
      expect(result.taxableAmount).toBe(4000);
      expect(result.taxTotal).toBe(0);
      expect(result.total).toBe(4000);
    });

    it("calculates percentage discount with CGST and SGST", () => {
      const items = [
        {
          description: "Website Development",
          quantity: 1,
          unitPrice: 5000,
        },
      ];

      const taxes = [
        {
          name: "CGST",
          rate: 9,
        },
        {
          name: "SGST",
          rate: 9,
        },
      ];

      const result = calculateInvoiceTotal(
        items,
        taxes,
        10,
        DiscountType.PERCENTAGE,
      );

      expect(result.subtotal).toBe(5000);

      // 10% of ₹5,000
      expect(result.discountAmount).toBe(500);

      // ₹5,000 - ₹500
      expect(result.taxableAmount).toBe(4500);

      expect(result.taxes).toEqual([
        {
          name: "CGST",
          rate: 9,
          amount: 405,
        },
        {
          name: "SGST",
          rate: 9,
          amount: 405,
        },
      ]);

      // ₹405 + ₹405
      expect(result.taxTotal).toBe(810);

      // ₹4,500 + ₹810
      expect(result.total).toBe(5310);
    });

    it("calculates fixed discount with IGST", () => {
      const items = [
        {
          description: "Development Services",
          quantity: 1,
          unitPrice: 10000,
        },
      ];

      const taxes = [
        {
          name: "IGST",
          rate: 18,
        },
      ];

      const result = calculateInvoiceTotal(
        items,
        taxes,
        2000,
        DiscountType.FIXED,
      );

      expect(result.subtotal).toBe(10000);
      expect(result.discountAmount).toBe(2000);
      expect(result.taxableAmount).toBe(8000);

      expect(result.taxes).toEqual([
        {
          name: "IGST",
          rate: 18,
          amount: 1440,
        },
      ]);

      expect(result.taxTotal).toBe(1440);
      expect(result.total).toBe(9440);
    });

    it("handles multiple taxes correctly", () => {
      const items = [
        {
          description: "Software Development",
          quantity: 1,
          unitPrice: 10000,
        },
      ];

      const taxes = [
        {
          name: "Tax A",
          rate: 5,
        },
        {
          name: "Tax B",
          rate: 10,
        },
        {
          name: "Tax C",
          rate: 3,
        },
      ];

      const result = calculateInvoiceTotal(items, taxes, 0, DiscountType.FIXED);

      expect(result.taxes).toEqual([
        {
          name: "Tax A",
          rate: 5,
          amount: 500,
        },
        {
          name: "Tax B",
          rate: 10,
          amount: 1000,
        },
        {
          name: "Tax C",
          rate: 3,
          amount: 300,
        },
      ]);

      expect(result.taxTotal).toBe(1800);
      expect(result.total).toBe(11800);
    });

    it("does not create a negative invoice when fixed discount exceeds subtotal", () => {
      const items = [
        {
          description: "Logo Design",
          quantity: 1,
          unitPrice: 1000,
        },
      ];

      const result = calculateInvoiceTotal(items, [], 3000, DiscountType.FIXED);

      expect(result.subtotal).toBe(1000);
      expect(result.discountAmount).toBe(1000);
      expect(result.taxableAmount).toBe(0);
      expect(result.taxTotal).toBe(0);
      expect(result.total).toBe(0);
    });

    it("does not create a negative invoice when percentage exceeds 100%", () => {
      const items = [
        {
          description: "Logo Design",
          quantity: 1,
          unitPrice: 1000,
        },
      ];

      const result = calculateInvoiceTotal(
        items,
        [],
        150,
        DiscountType.PERCENTAGE,
      );

      expect(result.discountAmount).toBe(1000);
      expect(result.taxableAmount).toBe(0);
      expect(result.taxTotal).toBe(0);
      expect(result.total).toBe(0);
    });

    it("supports decimal quantities", () => {
      const items = [
        {
          description: "Consulting",
          quantity: 2.5,
          unitPrice: 1000,
        },
      ];

      const result = calculateInvoiceTotal(items, [], 0, DiscountType.FIXED);

      expect(result.subtotal).toBe(2500);
      expect(result.total).toBe(2500);
    });

    it("returns calculated totals for every invoice item", () => {
      const items = [
        {
          description: "Design",
          quantity: 2,
          unitPrice: 1500,
        },
        {
          description: "Development",
          quantity: 3,
          unitPrice: 2000,
        },
      ];

      const result = calculateInvoiceTotal(items, [], 0, DiscountType.FIXED);

      expect(result.items).toEqual([
        {
          description: "Design",
          quantity: 2,
          unitPrice: 1500,
          total: 3000,
        },
        {
          description: "Development",
          quantity: 3,
          unitPrice: 2000,
          total: 6000,
        },
      ]);

      expect(result.subtotal).toBe(9000);
      expect(result.total).toBe(9000);
    });

    it("rounds monetary values to two decimal places", () => {
      const items = [
        {
          description: "Product",
          quantity: 3,
          unitPrice: 99.99,
        },
      ];

      const taxes = [
        {
          name: "GST",
          rate: 18,
        },
      ];

      const result = calculateInvoiceTotal(items, taxes, 0, DiscountType.FIXED);

      expect(result.subtotal).toBe(299.97);
      expect(result.taxableAmount).toBe(299.97);

      expect(result.taxes).toEqual([
        {
          name: "GST",
          rate: 18,
          amount: 53.99,
        },
      ]);

      expect(result.taxTotal).toBe(53.99);
      expect(result.total).toBe(353.96);
    });
  });
});
