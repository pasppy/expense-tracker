'use client'
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    const { user } = useAuth();

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
                    onClick={user ? (() => buttonHandler("dashboard")) : (() => buttonHandler("login"))}
                >
                    {user ? "Dashboard" : "Login"}
                </button>
            </div>
        </nav>
    )
}

export default Navbar