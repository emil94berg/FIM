"use client"
import type { components } from "@/types/schema"
import { useState, useEffect } from 'react'
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { authFetch } from "../auth/authFetch"

type Print = components["schemas"]["PrintDto"];

const chartConfig = {
    views: {
        label: "Prints created",
    },
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


export default function PrintsChart(){
    const [allPrints, setAllPrints] = useState<Print[]>([]);


    useEffect(() => {
        const loadPrints = async () => {
            try {
                const data: Print[] = await authFetch("https://localhost:7035/print");
                setAllPrints(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        loadPrints();
    }, []);

    //const chartData = Object.values(
    //    allPrints.reduce((acc, print) => {
    //        const date = new Date(print.createdAt).toISOString().split("T")[0];

    //        if (!acc[date]) {
    //            acc[date] = { date, count: 0 };
    //        }
    //        acc[date].count++;
    //        return acc;
    //    }, {} as Record<string, { date: string; count: number }>)
    //);
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const counts = allPrints.reduce((acc, print) => {
        const date = new Date(print.createdAt).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = lastSevenDays.map(date => ({
        date,
        count: counts[date] || 0
    }));

    const chartHeight = Math.max(250, chartData.length * 40);


    return (
    
        <Card >
            <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>Show number of prints per day</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 overflow-x-auto">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart
                        data={chartData}
                        margin={{ left: 12, right: 12, }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("sv-SE", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis height={chartHeight}
                        ></YAxis>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="count"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="count"
                            fill="var(--color-desktop)"
                            barSize={20} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )

}