import type { Metadata } from "next";
import Image from "next/image";
import { Toaster } from "sonner";

import { OnboardingForm } from "@/components/onboarding/BusinessOnboardingForm";

export const metadata: Metadata = {
  title: "Set up your business | Invoicelly",
  description:
    "Tell us about your business so your invoices carry the right details.",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Capped + centered: whitespace on the left/right past 1600px */}
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        {/* Form column — mobile stacked, tablet roomier, desktop half */}
        <section className="flex items-center justify-center px-5 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-6 xl:px-16">
          <div className="w-full max-w-md sm:max-w-lg">
            <OnboardingForm />
          </div>
        </section>

        {/* Visual column — full height & width optimized image (desktop+) */}
        <aside className="relative hidden overflow-hidden bg-muted lg:block">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop"
            alt="Business invoicing workspace"
            fill
            priority
            sizes="(max-width: 1024px) 0vw, (max-width: 1600px) 50vw, 800px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-primary/60 mix-blend-multiply"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground xl:p-10">
            <p className="text-xl font-semibold">Invoicelly</p>
            <p className="mt-2 max-w-sm text-sm opacity-90">
              Create professional invoices, track payments, and get paid
              faster.
            </p>
          </div>
        </aside>
      </div>

      <Toaster richColors position="bottom-right" />
    </main>
  );
}
