import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import { getCurrentUser } from "@/lib/auth/requireUser";
import { WRAP_CLASS } from "./df-constants";

export async function DfNav() {
  const user = await getCurrentUser();

  const links = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-xl sm:h-16">
      <div className={`${WRAP_CLASS} flex items-center justify-between gap-3`}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon icon={Invoice01Icon} size={18} strokeWidth={1.75} />
          </span>
          <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            Invoicelly
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[7px] px-[13px] py-1.5 font-display text-[13px] font-medium text-muted-foreground no-underline transition-colors duration-150 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-[7px] bg-primary px-3 py-[7px] text-center font-display text-[12px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-[13px]"
            >
              <span className="sm:hidden">Dashboard</span>
              <span className="hidden sm:inline">Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-[7px] bg-primary px-3 py-[7px] text-center font-display text-[12px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-[13px]"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded-[7px] border border-border bg-background px-3 py-[7px] text-center font-display text-[12px] font-semibold tracking-[-0.02em] text-foreground no-underline shadow-sm transition-colors hover:bg-muted sm:px-4 sm:text-[13px]"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
