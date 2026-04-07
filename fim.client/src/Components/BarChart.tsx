"use client"
import type { components } from "@/types/schema"
import { useState, useEffect, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { authFetch } from "../auth/authFetch"
import { Button } from "@/components/ui/button"

type Print = components["schemas"]["PrintDto"];

const chartConfig = {
    count: { label: "Prints" },
    desktop: { label: "Prints", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function PrintsChart() {
    const [allPrints, setAllPrints] = useState<Print[]>([]);
    const [range, setRange] = useState<"week" | "month">("week");

    useEffect(() => {
        const loadPrints = async () => {
            try {
                const data: Print[] = await authFetch("https://localhost:7035/print");
                setAllPrints(data);
            } catch (error) { console.error(error); }
        };
        loadPrints();
    }, []);

    const chartData = useMemo(() => {
        const daysToSee = range === "week" ? 7 : 30;
        const today = new Date();
        
        const timeLabels = Array.from({ length: daysToSee }).map((_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - i);
            return d.toISOString().split("T")[0];
        }).reverse();

        const counts = allPrints.reduce((acc, print) => {
            const date = new Date(print.createdAt).toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return timeLabels.map(date => ({
            date,
            count: counts[date] || 0
        }));
    }, [allPrints, range]);

    return (
        <Card className="border-none shadow-none bg-transparent h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
                <div>
                    <CardTitle>Print Activity</CardTitle>
                    <CardDescription>
                        {range === "week" ? "Last 7 days" : "Last 30 days"}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
                    <Button
                        variant={range === "week" ? "secondary" : "ghost"}
                        className={range === "week" ? "bg-white shadow-sm" : "bg-transparent"}
                        size="sm"
                        onClick={() => setRange("week")}
                    >
                        Week
                    </Button>
                    <Button
                        variant={range === "month" ? "secondary" : "ghost"}
                        className={range === "month" ? "bg-white shadow-sm" : "bg-transparent"}
                        size="sm"
                        onClick={() => setRange("month")}
                    >
                        Month
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-2 pt-6 flex-1">
                <ChartContainer 
                    config={chartConfig} 
                    className="h-[400px] w-full aspect-auto"
                >
                    <BarChart data={chartData} margin={{ left: 12, right: 12, top: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={range === "month" ? 40 : 10}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("sv-SE", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={10}
                            allowDecimals={false} 
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="count"
                                    labelFormatter={(value) => new Date(value).toLocaleDateString("sv-SE", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                />
                            }
                        />
                        <Bar 
                            dataKey="count" 
                            fill="hsl(var(--primary))" 
                            radius={[4, 4, 0, 0]}
                            barSize={range === "week" ? 45 : 12} 
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}