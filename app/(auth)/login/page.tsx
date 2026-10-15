import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sign in | Invoicelly",
  description: "Sign in to Invoicelly to manage your invoices.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    const business = await prisma.business.findFirst({
      where: { ownerId: user.id },
      select: { id: true },
    });
    redirect(business ? "/dashboard" : "/onboarding");
  }

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
