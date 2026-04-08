"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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
import type { components } from "@/types/schema"
import { useMemo } from "react"

type PrintDto = components["schemas"]["PrintDto"]

const chartConfig = {
    failures: { label: "Failures", color: "#ef4444"},
    successes: { label: "Successes", color: "#22c55e" }
} satisfies ChartConfig

export function ChartPrintOutcome({ prints }: { prints: PrintDto[] }) {
    const { chartData, totalPrints, compareTotal } = useMemo(() => {
        let successes: number = 0
        let failures: number = 0

        for (const print of prints) {
          const status = Number(print.status)
          if (status === 2) successes++
          else if (status === 3) failures++
        }
        const totalPrints = successes + failures
        const compareTotal = (totalPrints / prints.length) * 100
        const chartData = [
          { outcome: "Successes", prints: successes, fill: "var(--color-successes)" },
          { outcome: "Failures", prints: failures, fill: "var(--color-failures)" },
        ]
        return { chartData, totalPrints, compareTotal }
    }, [prints])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Print Outcome</CardTitle>
        <CardDescription>Outcome of All Prints</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="prints"
              nameKey="outcome"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPrints.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Prints
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 text-center text-sm text-muted-foreground">
          {compareTotal.toFixed(2)}% of all prints were successful
        </div>
      </CardContent>
    </Card>
  )
}
