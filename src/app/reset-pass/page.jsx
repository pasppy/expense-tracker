'use client'

import { useState } from "react"
import { supabaseBroswerClient } from "@/lib/supabase/browser-client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const supabase = supabaseBroswerClient()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)


    const handleReset = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-pass`,
        })

        setLoading(false)

        if (error) {
            toast.error(error.message, { position: "top-right" })
        } else {
            toast.success("Password reset email sent", { position: "top-right" })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                </CardHeader>

                <form onSubmit={handleReset}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Sending..." : "Send reset link"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
