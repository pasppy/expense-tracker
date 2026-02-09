'use client'
import { Button } from "@/components/ui/button"
import { supabaseBroswerClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
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
  return <div>
    <div>Product Landing Page</div>
    <Button onClick={session ? (() => buttonHandler("dashboard")) : (() => buttonHandler("login"))}> {session ? "Dashboard" : "Login"}</Button>
  </div>
}