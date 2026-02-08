import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";


export async function GET() {

    try {
        const supabse = await supabaseServerClient();
        const { data: { user } } = await supabse.auth.getUser();

        return NextResponse.json({
            success: true,
            statusCode: 200,
            user
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }
}