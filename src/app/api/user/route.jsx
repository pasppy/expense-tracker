import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return { user, supabase };
}

export async function GET() {

    try {
        const { user, supabase } = await authCheck();
        if (!user)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })

        let publicUrl = null

        if (user?.user_metadata?.profile_pic) {
            const { data } = supabase.storage
                .from("profile_pic")
                .getPublicUrl(user?.user_metadata?.profile_pic);

            publicUrl = data.publicUrl;
        }

        return NextResponse.json({
            success: true,
            statusCode: 200,
            user,
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