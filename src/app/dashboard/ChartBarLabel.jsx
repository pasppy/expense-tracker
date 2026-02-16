"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { format, formatDate } from "date-fns"

export const description = "A bar chart with a label"

export default function ChartBarLabel({ data, selectedMonth }) {
    const [chartData, setChartData] = useState([]);
    const currentYear = format(new Date(), "yyyy");
    const [currentMonth, setCurrentMonth] = useState(format(new Date().setMonth(Number(selectedMonth)), "MMMM"));

    // month label
    useEffect(() => {
        if (selectedMonth == -1)
            setCurrentMonth(format(new Date(), "MMMM"));
        else {
            setCurrentMonth(format(new Date().setMonth(Number(selectedMonth)), "MMMM"));
        }
    }, [selectedMonth])

    // format graph data
    useEffect(() => {

        const groupedCategory = data.reduce((acc, e) => {
            const category = e.categories?.name || "Uncategorized";

            if (!acc[category]) {
                acc[category] = 0;
            }

            acc[category] += e.amount;

            return acc
        }, {});

        // convert to array of objects and sort it 
        let sortedData = Object.entries(groupedCategory).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount)

        let topSevenCategories = sortedData.slice(0, 7);

        // combine categories with small amounts  
        let miscellaneousAmount = sortedData
            .slice(7)
            .reduce((sum, item) => sum + item.amount, 0)

        if (miscellaneousAmount > 0) {
            topSevenCategories.push({
                category: "Miscellaneous",
                amount: miscellaneousAmount
            })
        }

        setChartData(topSevenCategories);

    }, [data])

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
        label: {
            color: "var(--background)",
        },
    }

    return (
        <Card className={" mx-auto max-w-250 mt-8"}>
            <CardHeader>
                <CardTitle>Expense Analytics</CardTitle>
                <CardDescription>{selectedMonth == -1 ? (`January - ${currentMonth} ${currentYear}`) : `${currentMonth} ${currentYear}`}</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="h-[300px] flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground text-sm">
                            No expense data for selected range
                        </p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 20,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="category"
                                axisLine={false}
                                tick={false}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="amount" fill="var(--color-desktop)" radius={8}>
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>


            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    )
}