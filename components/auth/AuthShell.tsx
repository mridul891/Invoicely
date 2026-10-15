import { HugeiconsIcon } from "@hugeicons/react";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import Image from "next/image";
import Link from "next/link";

const AUTH_IMAGE_URL =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto grid min-h-svh w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        <section className="relative flex flex-col px-5 py-6 sm:px-10 md:p-10">
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
              Back
            </Link>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 px-1 py-1"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon icon={Invoice01Icon} size={16} strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Invoicelly
              </span>
            </Link>
          </div>
          <div className="relative flex flex-1 items-center justify-center py-8 md:py-0">
            <div className="w-full max-w-md sm:max-w-sm">{children}</div>
          </div>
        </section>
        <section className="relative hidden p-4 lg:block 2xl:p-6">
          <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-[0_24px_90px_-45px_rgba(0,0,0,0.8)] 2xl:rounded-2xl">
            <Image
              src={AUTH_IMAGE_URL}
              alt="Business invoicing workspace"
              fill
              priority
              sizes="(max-width: 1024px) 0vw, (max-width: 1600px) 50vw, 800px"
              className="object-cover brightness-[0.92] saturate-[1.06]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-background/10"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
