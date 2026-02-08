"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    Wallet,
    Tags,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabaseBroswerClient } from "@/lib/supabase/browser-client";
import { useEffect, useState } from "react";

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = supabaseBroswerClient();
    const [user, setUser] = useState(null);
    const { open, toggleSidebar } = useSidebar();

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/user');
            const { user } = await res.json();
            setUser(user);
        })()
    }, [])


    const handleLogout = async () => {
        await supabase.auth.signOut({ scope: "local" });
        router.replace("/login-signup");
    };

    return (
        <Sidebar collapsible="icon" >
            {/* ================= HEADER ================= */}
            <SidebarHeader className="border-b px-3 py-4">
                {/* When collapsed, show expand button below avatar */}
                {!open && (
                    <button
                        onClick={toggleSidebar}
                        className="mt-3 flex justify-center rounded-md p-1 hover:bg-muted"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}

                <div
                    className={cn(
                        "flex w-full items-center",
                        open ? "justify-between" : "justify-center"
                    )}
                >

                    {/* Avatar + Info */}
                    <div
                        className={cn(
                            "flex items-center gap-3 transition-all",
                            open ? "flex-row" : "flex-col"
                        )}
                    >
                        <Avatar className={cn(open ? "h-10 w-10" : "h-9 w-9")}>
                            <AvatarFallback>
                                {user?.user_metadata?.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info hides automatically on collapse */}
                        {open && (
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold">
                                    {user?.user_metadata?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user?.email}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Collapse Button (ChatGPT style) */}
                    {open && (
                        <button
                            onClick={toggleSidebar}
                            className="rounded-md p-1 hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                </div>


            </SidebarHeader>

            {/* ================= CONTENT ================= */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/dashboard"}
                                >
                                    <Link href="/dashboard">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/dashboard/add-expense"}
                                >
                                    <Link href="/dashboard/add-expense">
                                        <Wallet />
                                        <span>Manage Expenses</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/dashboard/categories"}
                                >
                                    <Link href="/dashboard/categories">
                                        <Tags />
                                        <span>Manage Categories</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* ================= FOOTER ================= */}
            <SidebarFooter className="border-t pb-18">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard/profile">
                                <User />
                                <span>Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
