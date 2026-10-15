import Link from "next/link";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

export function DfDemo() {
  return (
    <section id="demo" className="scroll-mt-14 border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <Reveal className="mb-10 text-center sm:mb-12">
          <p className="mb-[14px] font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Live demo
          </p>
          <h2 className="mb-[14px] font-dm text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-foreground">
            From line items to invoice
          </h2>
          <p className="m-0 mx-auto max-w-[520px] font-dm text-base leading-[1.65] text-muted-foreground">
            Watch how little effort it takes. Items in, totals out — reviewed
            by you before anything goes anywhere.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-[880px] grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="mb-3 font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                You enter
              </p>
              <div className="space-y-2">
                {[
                  ["Website redesign — homepage", "1 × $2,400.00"],
                  ["Brand asset pack (20 items)", "20 × $43.00"],
                  ["Monthly maintenance", "1 × $300.00"],
                ].map(([l, q]) => (
                  <div
                    key={l}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-4 py-3"
                  >
                    <span>
                      <span className="block font-dm text-[14px] font-medium text-foreground">{l}</span>
                      <span className="block font-mono text-xs text-muted-foreground">{q}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Client reused", "Tax applied", "Due date set"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border bg-background px-3 py-1 font-dm text-[12px] text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="mb-3 font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Invoicelly totals
              </p>
              <div className="rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="font-display text-[14px] font-semibold">INV-2026-0042</span>
                  <span className="font-dm text-[13px] text-muted-foreground">Due in 6 days</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 font-dm text-[13px]">
                  <span className="text-muted-foreground">Subtotal (3 items)</span>
                  <span className="font-medium tabular-nums">$3,560.00</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 font-dm text-[13px]">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium tabular-nums">$356.00</span>
                </div>
                <div className="flex items-center justify-between border-t border-border px-4 py-3 font-display text-[14px] font-semibold">
                  <span>Total due</span>
                  <span className="tabular-nums">$3,916.00</span>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-4 block rounded-lg bg-primary px-4 py-2.5 text-center font-display text-[13px] font-semibold text-primary-foreground no-underline hover:bg-primary/90"
              >
                Try it free
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-6 max-w-[520px] text-center font-dm text-[13px] leading-relaxed text-muted-foreground">
          Automatic math, your eyes on it. Review and edit everything before
          the invoice goes out.
        </Reveal>
      </div>
    </section>
  );
}
