import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    return { session, supabase };
}

export async function DELETE(req, { params }) {
    try {
        const { session, supabase } = await authCheck();

        if (!session)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })


        const { id } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                statusCode: 400,
                error: "Bad Request"
            })
        }

        // database query
        const { data, error } = await supabase.from('expenses').delete().eq("id", id)

        if (error)
            return NextResponse.json({
                success: false,
                statusCode: 500,
                error: error.message
            })

        return NextResponse.json({
            success: true,
            statusCode: 200,
            message: `Expense deleted successfully`
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }
}


export async function PUT(req, { params }) {
    try {
        const { session, supabase } = await authCheck();

        if (!session)
            return NextResponse.json({
                success: false,
                statusCode: 401,
                error: "Unauthorized user"
            })


        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                success: false,
                statusCode: 400,
                error: "Bad Request"
            })
        }

        const { category_id, amount, expense_date, note } = await req.json();

        if (amount <= 0 || !category_id || !expense_date) {
            return NextResponse.json({
                success: false,
                statusCode: 400,
                error: "Bad Request"
            })
        }

        // database query
        const { data, error } = await supabase.from('expenses').update({
            category_id,
            amount,
            expense_date,
            note
        }).eq("id", id)

        if (error)
            return NextResponse.json({
                success: false,
                statusCode: 500,
                error: error.message
            })

        return NextResponse.json({
            success: true,
            statusCode: 201,
            message: `Expense updated successfully`
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }
}