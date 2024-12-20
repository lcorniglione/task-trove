"use client";

import * as LucideIcons from "lucide-react";
import { Bell, CircleUser, Menu, Search } from "lucide-react";
import Link from "next/link";

import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Input } from "@/ui/input";
import { ModeToggle } from "@/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";
import { TypographyH4 } from "@/ui/typography";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function SideBar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: projects = [] } = api.project.getAll.useQuery();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/tasktrove1.webp"
                  alt="TaskTrove Icon"
                  width={32}
                  height={32}
                />
                <TypographyH4>Task Trove</TypographyH4>
              </div>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {projects.map((project) => {
                const projectRef = `/project/${project.id}`;
                const Icon = project.icon
                  ? LucideIcons.icons[
                      project.icon as keyof typeof LucideIcons.icons
                    ]
                  : null;

                return (
                  <Link
                    key={project.id}
                    href={projectRef}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === projectRef ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {project.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {projects.map((project) => {
                  const projectRef = `/project/${project.id}`;
                  const Icon = project.icon
                    ? LucideIcons.icons[
                        project.icon as keyof typeof LucideIcons.icons
                      ]
                    : null;

                  return (
                    <Link
                      key={project.id}
                      href={projectRef}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === projectRef ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {project.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SideBar;
