import requireOnboardedUser from "@/lib/auth/requireOnboardedUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboardedUser();
  return <>{children}</>;
}
