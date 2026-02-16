"use client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useEffect, useState } from "react"

function months() {

    let currentMonth = new Date().getMonth();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    return months.slice(0, currentMonth + 1);
}

export default function Metrics({ data, selectedMonth, setSelectedMonth }) {

    const [totalExpense, setTotalExpense] = useState(0);
    const monthList = months();


    useEffect(() => {
        setTotalExpense(data.reduce((acc, e) => acc + e.amount, 0));
    }, [data])

    return (
        <Card className=" mx-auto max-w-250">
            <CardHeader className={"flex justify-between items-center"}>
                <CardTitle>Dashboard</CardTitle>
                <CardAction>
                    <NativeSelect
                        id="range-selector"
                        value={selectedMonth}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedMonth(value);
                        }}
                    >
                        {monthList?.map((month, id) =>
                            <NativeSelectOption key={id} value={id}>
                                {month}
                            </NativeSelectOption>
                        ).reverse()}
                        <NativeSelectOption value={-1}>
                            All
                        </NativeSelectOption>

                    </NativeSelect>
                </CardAction>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">

                    <Card >
                        <CardHeader>
                            <CardTitle>Total Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">₹{totalExpense}</div>
                            {/* <p className="text-muted-foreground text-sm">
                        +12% from last month
                    </p> */}
                        </CardContent>
                    </Card>
                </div>

            </CardContent>


        </Card>
    )
}