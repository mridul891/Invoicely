import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

const FAQS = [
  {
    q: "How do I create an invoice?",
    a: "Pick a client, add line items with quantity and price, set taxes and discounts, add your payment details — totals calculate automatically. Review everything before it goes out.",
  },
  {
    q: "Can I reuse clients across invoices?",
    a: "Yes. Save a client once — name, email, phone, tax ID and address — then select them in one tap on every future invoice. No duplicate data entry.",
  },
  {
    q: "Does it handle taxes and discounts?",
    a: "Yes. Add multiple named taxes like GST with your own rates, plus percentage or fixed discounts. Tax amounts and balances are calculated for you.",
  },
  {
    q: "How do my clients pay me?",
    a: "Your UPI ID, account number, IFSC and bank name print right on the invoice, so clients have everything they need to pay you.",
  },
  {
    q: "How do I track what's paid?",
    a: "Every invoice carries a status — draft, sent, paid or overdue — with issue and due dates, so nothing slips through the cracks.",
  },
  {
    q: "Can I run multiple businesses?",
    a: "Yes. Keep separate business profiles — name, address, GSTIN, payment details — each printing on its own invoices. Available on Pro.",
  },
  {
    q: "Is my business data secure?",
    a: "Authenticated access keeps your business and client information protected at all times.",
  },
  {
    q: "Who is Invoicelly for?",
    a: "Freelancers, consultants, designers, developers, agencies and small businesses — anyone who wants billing to feel effortless instead of like paperwork.",
  },
];

export function DfFaq() {
  return (
    <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <Reveal className="mx-auto mb-10 max-w-[620px] text-center sm:mb-12">
          <p className="mb-4 font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            FAQ
          </p>
          <h2 className="mb-4 font-dm text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-balance text-foreground">
            Questions, answered
          </h2>
          <p className="m-0 font-dm text-[15px] leading-[1.7] text-pretty text-muted-foreground">
            Everything you need to know about billing without the paperwork.
          </p>
        </Reveal>

        <Reveal className="mx-auto max-w-[720px]">
          <Accordion
            defaultValue={["item-0"]}
            className="[--tw-duration:380ms]"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`}>
                <AccordionTrigger className="px-5 py-5 hover:no-underline sm:px-7">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-dm text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
                      {faq.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 sm:px-7">
                  <p className="m-0 max-w-[560px] pl-9 font-dm text-[13px] leading-[1.75] text-muted-foreground sm:pl-10 sm:text-[14px]">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
