'use client'
import { Button } from "@/components/ui/button"
import { supabaseBroswerClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const supabase = supabaseBroswerClient();
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data?.session)
        })
    }, [])

    const buttonHandler = (event) => {
        if (event === "login")
            router.push('/login-signup');
        else
            router.push('/dashboard');

    }

    return (
        <nav className=' w-full flex justify-between items-center py-3 border-b border-foreground'>
            <div ><h3 className=' text-2xl font-bold'>Expra</h3></div>
            <div className=''>
                <button
                    className="cursor-pointer border border-vibe-foreground bg-vibe text-white px-3 py-1 rounded-md"
                    onClick={session ? (() => buttonHandler("dashboard")) : (() => buttonHandler("login"))}
                >
                    {session ? "Dashboard" : "Login"}
                </button>
            </div>
        </nav>
    )
}

export default Navbar