'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onLogin = () => {
    router.push('/login-signup');
  }
  return <div>
    <div>Product Landing Page </div>
    <Button onClick={onLogin}>Login</Button>
  </div>
}