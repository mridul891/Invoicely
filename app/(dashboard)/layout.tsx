import requireOnboardedUser from "@/lib/auth/requireOnboardedUser";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireOnboardedUser();

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar
        data={{
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }}
      />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent">
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground" />
        </div>
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
