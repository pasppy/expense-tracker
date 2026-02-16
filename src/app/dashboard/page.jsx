"use client"
import { useEffect, useState } from "react";
import Metrics from "./Metrics"
import ChartBarLabel from "./ChartBarLabel";
import { format } from "date-fns";
import { toast } from "sonner";


export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const getExpenses = async () => {

        let start = new Date();
        let end = new Date();

        if (selectedMonth == -1) {
            start.setDate(1);
            start.setMonth(0);
            start = (format(start, "yyyy-MM-dd"));
            end = "";
        }
        else {
            start.setDate(1);
            start.setMonth(selectedMonth);
            start = (format(start, "yyyy-MM-dd"));

            end.setDate(1);
            end.setMonth(Number(selectedMonth) + 1);
            end.setDate(0);
            end = (format(end, "yyyy-MM-dd"));
        }

        const res = await fetch(`/api/expense?start=${start}&end=${end}`);
        const { data, error } = await res.json();

        if (error)
            return toast.error(error, { position: "top-right" });

        setExpenses(data);
    }

    useEffect(() => {
        getExpenses();
        // console.log("start ", startDate, "end ", endDate);

    }, [selectedMonth])

    return (
        <div className="">
            {/* metrics cards */}
            <Metrics data={expenses} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            <ChartBarLabel data={expenses} selectedMonth={selectedMonth} />

        </div>
    )
}
