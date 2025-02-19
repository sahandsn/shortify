import { auth } from "@/server/auth";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Home,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type TMenuItem = {
  label: string;
  href: string;
  isExternal?: boolean;
  Icon: LucideIcon;
};

export async function UserNav() {
  const menuItems: TMenuItem[] = [
    {
      label: "Home",
      href: "/",
      Icon: Home,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      Icon: LayoutDashboard,
    },
    {
      label: "Report a Bug",
      href: "https://github.com/sahandsn/shortify/issues/new",
      Icon: Bug,
      isExternal: true,
    },
  ];

  const session = await auth();
  if (!session?.user) {
    return (
      <Link
        href="/api/auth/signin"
        className={buttonVariants({
          variant: "outline",
          className: "group",
        })}
      >
        <span>Get Started</span>
        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-[2px]" />
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        name={session.user.name ?? "User Menu"}
        className={buttonVariants({
          variant: "ghost",
          size: "icon",
        })}
      >
        {session.user.name && (
          <Avatar>
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>
              {session.user.name.slice(0, 1).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-neutral-400">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem asChild key={item.href}>
            <Link
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
            >
              <item.Icon /> {item.label}
              {item.isExternal && <ArrowUpRight className="ms-auto" />}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/api/auth/signout">
            <LogOut /> Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
