import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    return { session, supabase };
}

export async function GET() {

    try {
        const { session, supabase } = await authCheck();

        if (!session)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })

        const { data } = supabase.storage
            .from("profile_pic")
            .getPublicUrl(session?.user?.user_metadata?.profile_pic);

        const publicUrl = data.publicUrl;

        return NextResponse.json({
            success: true,
            statusCode: 200,
            user: session?.user,
            profile_pic: publicUrl
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }
}
export async function PATCH(req) {

    try {
        const { supabase } = await authCheck();

        const formData = await req.formData();
        const name = formData.get("name");
        const profile_pic = formData.get("profile_pic");
        let profilePicPath = null;

        if (profile_pic) {
            const ext = profile_pic?.name.split(".").pop();
            const fileName = `db-${name.toLowerCase().split(" ").join("-")}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.${ext}`
            const { error: storageError } = await supabase.storage.from('profile_pic').upload(fileName, profile_pic)
            if (storageError) throw new Error(storageError.message)

            profilePicPath = fileName

        }

        await supabase.auth.updateUser({
            data: {
                name,
                ...(profilePicPath != null && { profile_pic: profilePicPath })
            } // user_metadata
        });

        return NextResponse.json({
            success: true,
            statusCode: 200,
            message: "User updated successfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: error.message
        })
    }
}