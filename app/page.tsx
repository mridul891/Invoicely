import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import AddInvoiceIcon from "@hugeicons/core-free-icons/AddInvoiceIcon";
import UsersIcon from "@hugeicons/core-free-icons/UsersIcon";
import ChartLineIcon from "@hugeicons/core-free-icons/ChartLineIcon";
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon";
import TickDouble01Icon from "@hugeicons/core-free-icons/TickDouble01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import BankIcon from "@hugeicons/core-free-icons/BankIcon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import ReceiptIcon from "@hugeicons/core-free-icons/ReceiptIcon";

const features = [
  {
    icon: AddInvoiceIcon,
    title: "Invoices in minutes",
    body: "Build polished, itemized invoices with automatic totals, tax, and discounts. No spreadsheet wrestling.",
  },
  {
    icon: UsersIcon,
    title: "Clients that stay organized",
    body: "Keep every client, business profile, and billing detail in one place. Reuse them on every invoice.",
  },
  {
    icon: ChartLineIcon,
    title: "Know what's paid",
    body: "Track draft, sent, paid, and overdue at a glance from your dashboard. Nothing slips through.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure by default",
    body: "Authenticated access keeps your business and client information protected at all times.",
  },
];

const steps = [
  {
    n: "01",
    title: "Add your business",
    body: "Set up your business profile once — name, address, and payment details.",
  },
  {
    n: "02",
    title: "Add clients",
    body: "Save the people and companies you bill, then reuse them forever.",
  },
  {
    n: "03",
    title: "Send invoices",
    body: "Create an invoice, review the totals, and send it. Track payment status after.",
  },
];

const lineItems: Array<[string, string]> = [
  ["Website redesign — homepage", "$2,400.00"],
  ["Brand asset pack (24 items)", "$860.00"],
  ["Monthly maintenance", "$300.00"],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.75} />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              Invoicelly
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
            <Link href="/product" className="transition-colors hover:text-foreground">
              Product
            </Link>
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how" className="transition-colors hover:text-foreground">
              How it works
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-2xs transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Free to start — no credit card required
        </p>
        <h1 className="mx-auto max-w-3xl font-heading text-5xl font-semibold leading-[1.05] tracking-tighter sm:text-7xl">
          Invoicing that gets you paid faster
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Invoicelly helps freelancers and small businesses create beautiful
          invoices, organize clients, and track payments — all in one simple app.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Create your first invoice
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
          </Link>
          <Link
            href="/product"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 sm:w-auto"
          >
            See how it works
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
          {["Unlimited clients", "Automatic totals & tax", "Payment tracking"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={TickDouble01Icon} size={16} strokeWidth={2} />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Product visual ──────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 sm:pb-24">
        <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b px-5 py-3.5">
            <span className="h-3 w-3 rounded-full bg-muted" />
            <span className="h-3 w-3 rounded-full bg-muted" />
            <span className="h-3 w-3 rounded-full bg-muted" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              INV-2026-0042 · Acme Studio
            </span>
            <span className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Paid
            </span>
          </div>
          <div className="space-y-3 px-5 py-6 sm:px-8">
            {lineItems.map(([label, amount]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3.5 text-sm"
              >
                <span className="font-medium">{label}</span>
                <span className="shrink-0 font-mono text-muted-foreground">{amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 pt-1 text-sm text-muted-foreground">
              <span>Tax (10%)</span>
              <span className="font-mono">$356.00</span>
            </div>
            <div className="flex items-center justify-between border-t px-4 pt-4">
              <span className="font-medium">Total due</span>
              <span className="font-mono text-xl font-semibold tracking-tight">$3,916.00</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: BankIcon, stat: "94%", label: "Paid on time" },
            { icon: CreditCardIcon, stat: "6 days", label: "Average time to pay" },
            { icon: ReceiptIcon, stat: "$0", label: "Currently outstanding" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-2xs"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-heading text-xl font-semibold tracking-tight">
                  {s.stat}
                </span>
                <span className="block text-sm text-muted-foreground">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-y bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Features
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to bill like a pro
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            One workspace for your business, your clients, and every invoice between them.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-card p-8 shadow-2xs transition-shadow hover:shadow-sm"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <HugeiconsIcon icon={f.icon} size={22} strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          From setup to paid in three steps
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t-2 border-primary pt-6">
              <p className="font-mono text-sm font-medium text-muted-foreground">{s.n}</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ───────────────────────────────────────── */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
          <blockquote className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
            “I used to dread billing day. Now invoices go out in minutes — and
            clients actually pay on time.”
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Maya R.</span> · Freelance designer
          </p>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────── */}
      <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20 sm:py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing
        </p>
        <h2 className="mt-3 text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, honest pricing
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-muted-foreground">
          Start free. Upgrade when your business takes off.
        </p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-8 shadow-2xs">
            <h3 className="font-heading text-lg font-semibold">Starter</h3>
            <p className="mt-2 font-heading text-4xl font-semibold tracking-tight">
              $0<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Up to 10 invoices / month", "Unlimited clients", "Payment status tracking"].map(
                (li) => (
                  <li key={li} className="flex items-center gap-2.5 text-muted-foreground">
                    <HugeiconsIcon icon={TickDouble01Icon} size={16} strokeWidth={2} />
                    {li}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-2xs transition-colors hover:bg-primary/90"
            >
              Start for free
            </Link>
          </div>
          <div className="rounded-xl bg-primary p-8 text-primary-foreground shadow-sm">
            <h3 className="font-heading text-lg font-semibold">Pro</h3>
            <p className="mt-2 font-heading text-4xl font-semibold tracking-tight">
              $12
              <span className="text-base font-normal text-primary-foreground/70">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Unlimited invoices", "Multiple businesses", "Priority support"].map((li) => (
                <li key={li} className="flex items-center gap-2.5 text-primary-foreground/90">
                  <HugeiconsIcon icon={TickDouble01Icon} size={16} strokeWidth={2} />
                  {li}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 flex h-11 items-center justify-center rounded-lg bg-primary-foreground text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA band ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-sm sm:px-16">
          <h2 className="mx-auto max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop chasing payments. Start invoicing.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
            Join freelancers and small teams billing with Invoicelly today.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-8 text-base font-medium text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Get started free
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.75} />
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight">
                Invoicelly
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Simple invoicing for freelancers and small businesses.
            </p>
          </div>
          <nav className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </p>
            {[
              ["Features", "#features"],
              ["Pricing", "#pricing"],
              ["How it works", "#how"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
          <nav className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              App
            </p>
            {[
              ["Product tour", "/product"],
              ["Dashboard", "/dashboard"],
              ["Sign in", "/dashboard"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
            <span>© 2026 Invoicelly. All rights reserved.</span>
            <span className="font-mono">Built for people who bill.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
