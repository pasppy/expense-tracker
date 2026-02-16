import { supabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

const authCheck = async () => {
    const supabase = await supabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    return { session, supabase };
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


        const { category_id, amount, expense_date, note } = await req.json();

        if (amount <= 0 || !category_id || !expense_date) {
            return NextResponse.json({
                success: false,
                statusCode: 400,
                error: "Bad Request"
            })
        }

        // database query
        const { data, error } = await supabase.from('expenses').insert({
            user_id: session.user.id,
            category_id,
            amount,
            expense_date,
            note
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
            message: `Expense added successfully`
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            statusCode: 500,
            error: "Internal Server Error"
        })
    }
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

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        // database select query 
        let query = supabase
            .from("expenses")
            .select("*, categories(name)")
            .order('expense_date', { ascending: false })
            .order("created_at", { ascending: false });


        // apply filters
        if (startDate && endDate) {
            query = query
                .gte("expense_date", startDate)
                .lte("expense_date", endDate)
        }

        if (startDate) {
            query = query
                .gte("expense_date", startDate)
        }

        const { data, error } = await query;

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
