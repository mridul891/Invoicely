import { InvoicePressFigure } from "@/components/figures/invoice-press/figure";
import { SealFigure } from "@/components/figures/client-seal/figure";
import { SorterFigure } from "@/components/figures/status-sorter/figure";
import { TotalizerFigure } from "@/components/figures/tax-totalizer/figure";
import { DfNav } from "@/components/landing/df-nav";
import { DfHero } from "@/components/landing/df-hero";
import { DfDemo } from "@/components/landing/df-demo";
import { DfSteps } from "@/components/landing/df-steps";
import { DfSplit } from "@/components/landing/df-split";
import { DfStats } from "@/components/landing/df-stats";
import { DfPricing } from "@/components/landing/df-pricing";
import { DfFaq } from "@/components/landing/df-faq";
import { DfFooter } from "@/components/landing/df-footer";
import { ItemizedVisual } from "@/components/landing/df-visuals";

function IsoFigure({ children }: { children: React.ReactNode }) {
  return (
    <div className="iso" data-theme="light">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <DfNav />
      <DfHero />
      <DfDemo />
      <DfSteps />

      <div id="features" className="scroll-mt-14">
        <DfSplit
          eyebrow="Itemized invoices"
          title="Every line, accounted for."
          body="Quantity × unit price on every row, HSN/SAC codes where they belong, invoice numbers and currency — structured line items, not spreadsheet wrestling."
          bullets={[
            "Quantity and unit price per line item",
            "HSN/SAC codes for tax compliance",
            "Invoice numbers and multi-currency",
            "Notes and payment terms included",
          ]}
          visual={<ItemizedVisual />}
        />
      </div>

      <DfSplit
        eyebrow="Automatic totals & tax"
        title="Tax math, handled."
        body="Multiple named taxes plus percentage or fixed discounts. Crank the rate and watch where every dollar goes — the bars always add to one full bar."
        bullets={[
          "Multiple named taxes at your own rates",
          "Percentage or fixed discounts",
          "Subtotal, tax and balance calculated",
          "Review the readout before anything is final",
        ]}
        visual={
          <IsoFigure>
            <TotalizerFigure />
          </IsoFigure>
        }
        reverse
      />

      <DfSplit
        eyebrow="Payment status tracking"
        title="Know what's paid."
        body="Draft, sent, paid and overdue — with issue and due dates on every invoice. File each one down the rail and nothing slips through."
        bullets={[
          "Draft, sent, paid and overdue states",
          "Due dates that warn you early",
          "Overdue stands out at a glance",
          "Dashboard answers, no digging",
        ]}
        visual={
          <IsoFigure>
            <SorterFigure />
          </IsoFigure>
        }
      />

      <DfSplit
        eyebrow="Send it, get paid"
        title="From draft to paid."
        body="Stamp the invoice sent, drop the payment coin, and read days-to-paid off the dial. The whole lifecycle as one machine — and every number is real."
        bullets={[
          "Create, review, then send",
          "UPI and bank details printed on it",
          "Payment lands in the tray",
          "Average of 6 days to paid",
        ]}
        visual={
          <IsoFigure>
            <InvoicePressFigure />
          </IsoFigure>
        }
        reverse
      />

      <DfSplit
        eyebrow="Businesses & clients"
        title="Set up once, reuse forever."
        body="Business profiles with GSTIN and billing address, a client book that carries details forward, and payment details that travel with every bill. Pull a card — the seal does the rest."
        bullets={[
          "Business profiles with GSTIN + address",
          "One-tap reusable client selection",
          "UPI ID, IFSC and bank on invoices",
          "Multiple businesses on Pro",
        ]}
        visual={
          <IsoFigure>
            <SealFigure />
          </IsoFigure>
        }
      />

      <DfStats />
      <DfPricing />
      <DfFaq />
      <DfFooter />
    </div>
  );
}
