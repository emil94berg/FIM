"use client"
import type { components } from "@/types/schema"
import { useState, useEffect } from 'react'
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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

    const charData = Object.values(
        allPrints.reduce((acc, print) => {
            const date = new Date(print.createdAt).toISOString().split("T")[0];

            if (!acc[date]) {
                acc[date] = { date, count: 0 };
            }
            acc[date].count++;
            return acc;
        }, {} as Record<string, { date: string; count: number }>)
    );


    return (
    
        <Card className="m-4">
            <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>Show number of prints per day</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={charData}
                        margin={{left:12, right:12,}}
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
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
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
                        <Bar dataKey="count" fill="var(--color-desktop)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )

}