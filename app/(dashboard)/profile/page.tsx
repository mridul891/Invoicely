import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
          Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Profile</h1>
        <p className="text-sm leading-[1.7] text-muted-foreground">
          Manage your account information.
        </p>
      </header>

      <main>
        <ProfileForm />
      </main>
    </div>
  );
}
