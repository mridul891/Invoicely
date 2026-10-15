import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    per: "/month",
    desc: "For freelancers sending their first professional invoices.",
    cta: "Start for free",
    primary: false,
    features: [
      "Up to 10 invoices / month",
      "Unlimited clients",
      "Itemized line items + HSN/SAC",
      "Tax & discount calculations",
      "UPI + bank details on invoices",
      "Payment status tracking",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    per: "/month",
    desc: "For independents and teams billing every week.",
    cta: "Go Pro",
    primary: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Unlimited invoices",
      "Multiple businesses",
      "Business profiles + GSTIN",
      "Notes + payment terms",
      "Priority support",
    ],
  },
];

export function DfPricing() {
  return (
    <section id="pricing" className="scroll-mt-14 border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <Reveal className="mb-10 text-center sm:mb-14">
          <p className="mb-[14px] font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Pricing
          </p>
          <h2 className="mb-3 font-dm text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-foreground">
            Simple pricing for people who invoice
          </h2>
          <p className="m-0 mx-auto max-w-[760px] font-dm text-[15px] leading-relaxed text-muted-foreground">
            Start free. Upgrade when your business takes off.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-4 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90} className="h-full">
              <div className="relative flex h-full flex-col rounded-[12px] border border-border bg-card px-5 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:px-6 sm:py-7">
                {plan.primary && (
                  <div className="pointer-events-none absolute -inset-px -z-10 rounded-[14px] bg-[radial-gradient(circle_at_top,var(--primary),var(--primary)_45%,transparent_70%)] opacity-10 blur-sm" />
                )}
                {plan.badge && (
                  <div className="absolute top-3 right-3 rounded-full border border-border bg-muted px-2.5 py-[4px] font-dm text-[10px] font-semibold tracking-[0.045em] text-foreground sm:top-4 sm:right-4">
                    {plan.badge}
                  </div>
                )}
                <p className="mt-0 mb-1 font-dm text-[13px] font-semibold text-muted-foreground">
                  {plan.name}
                </p>
                <p className="mt-0 mb-1 font-display text-[clamp(28px,3vw,36px)] font-semibold tracking-[-0.04em] text-foreground">
                  {plan.price}
                  <span className="font-dm text-[14px] font-normal text-muted-foreground">
                    {plan.per}
                  </span>
                </p>
                <p className="mt-0 mb-6 min-h-0 font-dm text-[13px] leading-relaxed text-muted-foreground sm:min-h-[44px]">
                  {plan.desc}
                </p>
                <Link
                  href="/login"
                  className="mb-6 block rounded-[8px] bg-primary px-0 py-[10px] text-center font-display text-[13px] font-semibold tracking-[-0.01em] text-primary-foreground no-underline transition-all duration-200 hover:bg-primary/90"
                >
                  {plan.cta}
                </Link>
                <div className="flex flex-1 flex-col gap-[9px]">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={12}
                        color="var(--muted-foreground)"
                        className="shrink-0"
                      />
                      <span className="font-dm text-[13px] text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 flex max-w-[760px] flex-col gap-4 rounded-[10px] border border-border bg-muted/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="mt-0 mb-1 font-dm text-[14px] font-semibold text-foreground">
              Just getting started?
            </p>
            <p className="m-0 font-dm text-[13px] text-muted-foreground">
              Starter is free — no credit card required, cancel anytime.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 rounded-[7px] border border-border bg-background px-[18px] py-2 text-center font-display text-[13px] font-semibold text-foreground no-underline transition-colors duration-200 hover:bg-muted"
          >
            Start free →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
