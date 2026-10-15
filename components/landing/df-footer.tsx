import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import { WRAP_CLASS } from "./df-constants";
import { Reveal } from "./reveal";
import { BackToTop } from "./back-to-top";

export function DfFooter() {
  const footerLinks = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sign in", href: "/login" },
  ];

  return (
    <>
      <section className="border-t border-border bg-background px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-7 lg:py-[120px]">
        <Reveal className="mx-auto max-w-[640px]">
          <h2 className="mt-0 mb-5 font-display text-[clamp(36px,5.5vw,60px)] leading-[1.05] font-semibold tracking-[-0.045em] text-foreground">
            Stop chasing payments.
            <br />
            Start invoicing.
          </h2>
          <p className="mx-auto mt-0 mb-9 max-w-[400px] font-dm text-base leading-[1.65] text-muted-foreground">
            Join freelancers and small teams billing with Invoicelly today.
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-[7px] rounded-lg bg-primary px-6 py-3 font-display text-[14px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:w-auto sm:px-7 sm:text-[15px]"
            >
              Create your first invoice{" "}
              <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </Link>
            <Link
              href="#demo"
              className="w-full rounded-lg border border-border bg-background px-[22px] py-3 font-display text-[14px] font-medium text-foreground no-underline transition-colors hover:bg-muted sm:w-auto sm:text-[15px]"
            >
              See how it works
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {["No credit card required", "Free to start", "Cancel anytime"].map((text) => (
              <span key={text} className="flex items-center gap-[5px] font-dm text-xs text-muted-foreground">
                <HugeiconsIcon icon={Tick02Icon} size={11} color="var(--muted-foreground)" />{" "}
                {text}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border bg-background pt-12 pb-10 sm:pt-16">
        <div className={WRAP_CLASS}>
          <div className="rounded-2xl bg-primary px-5 py-8 text-white sm:px-7 sm:py-10 lg:px-10 lg:py-12">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:mb-14 md:flex-row">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary">
                    <HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">
                    Invoicelly
                  </span>
                </div>
                <p className="mt-0 mb-5 max-w-[200px] font-dm text-[13px] leading-[1.6] text-white/80">
                  Invoices, without the paperwork.
                </p>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 font-mono text-xs text-white/80">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  All systems operational
                </p>
              </div>
              <div className="flex flex-wrap justify-start gap-4 sm:gap-5 md:justify-end">
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-dm text-[13px] text-white/80 no-underline transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/20 pt-6" aria-hidden>
              <p className="cursor-default py-3 text-center font-display text-[clamp(2rem,11vw,7.25rem)] leading-none font-bold tracking-tight text-white/15 select-none">
                INVOICELLY
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-dm text-xs text-white/70">
                © 2026 Invoicelly. All rights reserved.
              </span>
              <span className="font-mono text-xs text-white/70">
                Built for people who bill.
              </span>
              <span className="[&_button]:border-white/25 [&_button]:text-white/70 [&_button]:hover:border-white/60 [&_button]:hover:text-white">
                <BackToTop />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
