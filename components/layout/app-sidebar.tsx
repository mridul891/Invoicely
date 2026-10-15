"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowLeftDoubleIcon from "@hugeicons/core-free-icons/ArrowLeftDoubleIcon";
import File02Icon from "@hugeicons/core-free-icons/File02Icon";
import Logout01Icon from "@hugeicons/core-free-icons/Logout01Icon";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type UserInfo = {
  id: string;
  email: string;
  name: string | null;
  image: string | null | undefined;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof File02Icon;
};

const NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/dashboard",
    label: "Invoices",
    icon: File02Icon,
  },
] as const;

function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href;
}

function getInitials(name: string | null): string {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

export function AppSidebar({ data }: { data: UserInfo }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const [isPending, startTransition] = useTransition();

  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  const handleSignOut = useCallback(() => {
    if (isPending) return;
    startTransition(async () => {
      try {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      } catch (error) {
        console.error("Failed to sign out:", error);
      }
    });
  }, [isPending, router]);

  const userInitials = getInitials(data.name);

  return (
    <SidebarPrimitive variant="inset" collapsible="icon" aria-label="Main navigation">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link
                    href="/dashboard"
                    onClick={closeMobileSidebar}
                    aria-label="Go to dashboard"
                    className="flex min-w-0 items-center gap-2"
                  />
                }
                size="lg"
                tooltip="Dashboard"
                className="h-11 rounded-xl px-2.5"
              >
                <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                  Invoicelly
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger
            className="relative z-20 size-9 shrink-0 rounded-lg text-foreground hover:bg-muted hover:text-foreground"
            title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          >
            <HugeiconsIcon
              icon={ArrowLeftDoubleIcon}
              aria-hidden="true"
              className={`size-4 transition-transform duration-200 ${
                state === "collapsed" ? "rotate-180" : ""
              }`}
            />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="px-3 pb-1 text-[11px] font-semibold tracking-[0.06em] text-sidebar-foreground/55 uppercase">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAV_ITEMS.map(({ href, label, icon }) => {
                const active = isNavItemActive(pathname, href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={href}
                          onClick={closeMobileSidebar}
                          aria-current={active ? "page" : undefined}
                        />
                      }
                      isActive={active}
                      tooltip={label}
                      className="h-10 rounded-xl px-3 text-[13px] font-medium data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-black"
                    >
                      <HugeiconsIcon icon={icon} aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pt-2 pb-3">
        <SidebarSeparator className="mx-1 mb-2" />

        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link
                  href="/profile"
                  onClick={closeMobileSidebar}
                  aria-label="Edit profile"
                  title="Edit profile"
                />
              }
              size="lg"
              tooltip={`${data.name} — Edit profile`}
              className="h-12 rounded-xl px-3"
            >
              {data.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.image}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold"
                >
                  {userInitials}
                </span>
              )}

              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {data.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              tooltip="Sign out"
              className="h-10 rounded-xl px-3 text-[13px] font-medium"
            >
              <HugeiconsIcon icon={Logout01Icon} aria-hidden="true" />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarPrimitive>
  );
}
