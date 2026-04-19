'use client'
import { supabaseBroswerClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/auth";


export default function LoginSignUp() {
    const router = useRouter();
    const supabase = supabaseBroswerClient();

    const { user, loading } = useAuth();
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(false);

    const resetLogin = () => {
        setMode("login");
        setName('');
        setEmail('');
        setPass('');
        setShowPass(false);
    }

    const resetSignUp = () => {
        setMode("signup");
        setName('');
        setEmail('');
        setPass('');
        setShowPass(false);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (mode === "login") {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });
            if (error) {
                toast.error(error.message, { position: "top-right" });
            }
            else {
                toast.success("Logged in successfully", { position: "top-right" });
                setEmail("");
                return router.replace('/dashboard');
            }
        }
        else {
            const { error } = await supabase.auth.signUp({
                email, password: pass,
                options: {
                    data: {
                        name
                    }
                }
            })
            if (error) {
                toast.error(error.message, { position: "top-right" });
            } else {
                toast.success("Account created successfully", { position: "top-right" });
                setEmail("");
                return router.replace('/dashboard');
            }
        }
        setPass("")
        setIsLoading(false);
    }

    useEffect(() => {
        if (!loading && user) return router.replace('/dashboard');
    })

    if (loading) return null;

    return (
        <div className="h-screen w-screen flex flex-col items-center">
            <div className="flex bg-secondary mt-20 mb-8 p-1  rounded-md">
                <Button variant={`${mode === 'login' ? "default" : "secondary"}`} className='cursor-pointer' onClick={resetLogin}>Login</Button>
                <Button variant={`${mode === 'signup' ? "default" : "secondary"}`} className='cursor-pointer' onClick={resetSignUp}>Sign Up</Button>
            </div>
            {mode === "login" ?
                (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={submitHandler}>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="/reset-pass"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <div className="relative">

                                            <Input id="password" type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} required />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                                onClick={() => setShowPass(!showPass)}
                                            >
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex-col gap-2 mt-6">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </form>


                    </Card>
                )
                :
                (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Create a new account</CardTitle>
                            <CardDescription>
                                Enter your details to create a new account
                            </CardDescription>

                        </CardHeader>
                        <form onSubmit={submitHandler}>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alex"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input id="password" type={showPass ? "text" : "password"}
                                                value={pass}
                                                onChange={(e) => setPass(e.target.value)} required />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                                onClick={() => setShowPass(!showPass)}
                                            >
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 mt-6">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Signing up..." : "Sign up"}
                                </Button>
                            </CardFooter>
                        </form>

                    </Card>
                )
            }
        </div >

    )
}