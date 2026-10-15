import type { Metadata } from "next";
import { InvoiceMachineFigure } from "@/components/figures/invoice-machine/figure";

export const metadata: Metadata = {
  title: "The Invoice Machine — Invoicelly",
  description: "Interactive isometric preview: business data in, finished invoice out.",
};

export default function InvoiceMachinePreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="font-dm text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Standalone preview
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          The Invoice Machine
        </h1>
        <div className="iso mt-6" data-theme="light">
          <InvoiceMachineFigure />
        </div>
      </main>
    </div>
  );
}
