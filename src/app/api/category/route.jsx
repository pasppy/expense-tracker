import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";


const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    return { session, supabase };
}


export async function GET(req) {
    try {
        const { session, supabase } = await authCheck();

        if (!session)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })

        // database select query 
        const { data, error } = await supabase.from('categories').select("id, name");

        if (error) {

            return NextResponse.json({
                success: false,
                statusCode: 500,
                error: error.message
            })
        }

        // returning data
        return NextResponse.json({
            success: true,
            statusCode: 200,
            data
        })
    }
    catch (err) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }


}

export async function POST(req) {

    try {
        const { session, supabase } = await authCheck();

        if (!session)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })


        const { name } = await req.json();

        // database query
        const { data, error } = await supabase.from('categories').insert({
            user_id: session.user.id,
            name
        })

        if (error)
            return NextResponse.json({
                success: false,
                statusCode: 500,
                error: error.message
            })

        return NextResponse.json({
            success: true,
            statusCode: 201,
            message: `${name} category created successfully`
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }


}