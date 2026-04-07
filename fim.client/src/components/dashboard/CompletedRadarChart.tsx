import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import type { components } from "@/types/schema"

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
    ChartTooltip
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

type Print = components["schemas"]["PrintDto"]
type charData = {
    month: string,
    numberOfPrints: number
}

type CompletedPrintsProps = {
    prints: Print[]
}


const chartConfig = {
    desktop: {
        label: "Completed",
        color: "var(--chart-1)"
    }
}



export function CompletedPrintsChart({ prints }: CompletedPrintsProps) {
    const [data, setData] = useState<charData[]>([]);

    const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    useEffect(() => {
        const groupedData = prints.reduce((acc: charData[], print) => {
            const date = new Date(String(print.estimatedEndTime))
            const month = date.toLocaleString("en-US", { month: "long" })

            const existing = acc.find((item: charData) => item.month === month)

            if (existing) {
                existing.numberOfPrints += 1
            }
            else {
                acc.push({ month, numberOfPrints: 1 })
            }

            return acc
        }, [] as charData[])
        groupedData.sort((a:charData, b:charData) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
        setData(groupedData);
    },[prints])
    




    return (
        <Card style={{maxWidth: "30%"}}>
            <CardHeader>
                <CardTitle>Completed prints</CardTitle>
                <CardDescription>Completed prints per month</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={data} >
                        <ChartTooltip cursor={false}></ChartTooltip>
                        <PolarAngleAxis dataKey="month"></PolarAngleAxis>
                        <PolarGrid></PolarGrid>
                        <Radar
                            dataKey="numberOfPrints"
                            fill="var(--color-desktop)"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                        ></Radar>
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                Total number of completed prints: {prints.length}
            </CardFooter>
        </Card>
    )
}