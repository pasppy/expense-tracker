'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabaseBroswerClient } from "@/lib/supabase/browser-client"

export default function UpdatePasswordPage() {
    const supabase = supabaseBroswerClient()
    const router = useRouter()
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // IMPORTANT: Supabase session is already set via email link
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.replace("/")
            }
        })
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password,
        })

        setLoading(false)

        if (error) {
            toast.error(error.message, { position: "top-right" })
        } else {
            toast.success("Password updated successfully", { position: "top-right" })
            router.replace("/login-signup")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Set New Password</CardTitle>
                </CardHeader>

                <form onSubmit={handleUpdate}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">

                                <Input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
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
                    </CardContent>

                    <CardFooter>
                        <Button className="w-full mt-4" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div >
    )
}
