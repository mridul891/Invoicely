import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import { InvoiceMachineFigure } from "@/components/figures/invoice-machine/figure";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";

export function DfHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-0 sm:pt-28 lg:pt-32">
      {/* signature radial blue glow, top-center */}
      <div className="pointer-events-none absolute top-[-220px] left-1/2 h-[460px] w-[620px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(32,97,238,0.06)_0%,transparent_65%)] sm:top-[-300px] sm:h-[600px] sm:w-[900px]" />

      <div className={`${WRAP_CLASS} relative text-center`}>
        <Reveal>
          <div className="mb-7 inline-flex items-center gap-[7px] rounded-full border border-border bg-muted px-[14px] py-[5px] sm:mb-9">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
            <span className="font-dm text-xs text-muted-foreground">
              Free to start — no credit card required
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mx-auto mb-5 max-w-[820px] font-display text-[clamp(30px,8vw,60px)] leading-[1.02] font-medium tracking-[-0.045em] text-foreground sm:mb-6 sm:leading-none">
            Invoices, <br />
            without the <span className="text-primary italic">paperwork.</span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mb-8 max-w-[560px] font-dm text-[16px] leading-[1.65] tracking-[-0.015em] text-muted-foreground sm:mb-10 sm:text-[18px]">
            Create beautiful invoices, organize clients, and track payments —
            all in one simple app.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:mb-14 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center gap-[7px] rounded-lg bg-primary px-5 py-3 font-display text-[14px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:px-[26px] sm:text-[15px]"
            >
              Create your first invoice <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </Link>
            <Link
              href="#demo"
              className="flex items-center gap-[7px] rounded-lg border border-border bg-background px-5 py-3 font-display text-[14px] font-medium text-foreground no-underline transition-colors hover:bg-muted sm:px-[26px] sm:text-[15px]"
            >
              See how it works
            </Link>
          </div>
        </Reveal>
      </div>

      <div className={`${WRAP_CLASS} relative max-w-[1200px] py-8 sm:py-10`}>
        <div className="pointer-events-none absolute top-[10%] left-1/2 z-0 h-[220px] w-[85%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(32,97,238,0.08)_0%,transparent_70%)] sm:h-[300px] sm:w-[70%]" />
        <Reveal className="relative z-[1]">
          <div className="iso overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-black/5" data-theme="light">
            <InvoiceMachineFigure />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
