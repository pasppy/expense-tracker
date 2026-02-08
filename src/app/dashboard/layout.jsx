'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export default function DashboardLayout({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/user');
            const { user } = await res.json();

            if (!user) {
                return router.replace('/login-signup');
            }
            setUser(user);
            setLoading(false)
        })()

    }, [])

    if (loading)
        return null;

    return (

        <SidebarProvider >
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                {/* Mobile / Top bar */}
                <header className="flex items-center gap-2 border-b px-4 py-2 md:hidden">
                    <SidebarTrigger />
                </header>

                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>


    )
}