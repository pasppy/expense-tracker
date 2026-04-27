import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return { user, supabase };
}

export async function GET(req,) {

    try {
        const { user, supabase } = await authCheck();

        const { searchParams } = new URL(req.url);

        const ext = searchParams.get("ext");
        const name = user?.id;

        const fileName = `avatar-${name}.${ext}`

        const { data, error } = await supabase.storage.from("profile_pic").createSignedUploadUrl(fileName);

        if (error) throw error;

        return Response.json({
            success: true,
            signedUrl: data.signedUrl,
            path: fileName

        })

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        })
    }

}