"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseBroswerClient } from "@/lib/supabase/browser-client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const supabase = supabaseBroswerClient();


    const [user, setUser] = useState(null);
    const [userDp, setUserDp] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        setLoading(true);
        const res = await fetch('/api/user');
        const { user, profile_pic } = await res.json();

        setUser(user);
        setUserDp(profile_pic);
        setLoading(false);
    }

    useEffect(() => {
        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener.subscription.unsubscribe()

    }, [])

    return (
        <AuthContext.Provider value={{ user, userDp, loading, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider }