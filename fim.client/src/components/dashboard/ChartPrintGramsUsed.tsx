"use client"
import { useMemo } from "react"
import type { components } from "@/types/schema"
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

type PrintDto = components["schemas"]["PrintDto"]

const chartConfig = {
  successes: { label: "Successes", color: "#22c55e" },
  failures: { label: "Failures", color: "#ef4444" },
} satisfies ChartConfig

export function ChartPrintGramsUsed({ prints }: { prints: PrintDto[] }) {
  const { chartData, totalGrams, successRate } = useMemo(() => {
    let successGrams = 0
    let failureGrams = 0

    for (const print of prints) {
      const status = Number(print.status)
      if (status !== 2 && status !== 3 && status !== 4) continue

      const grams = Number(print.gramsUsed)
      if (!Number.isFinite(grams) || grams <= 0) continue

      if (status === 2) successGrams += grams
      else failureGrams += grams
    }

    const totalGrams = successGrams + failureGrams
    const successRate = totalGrams > 0 ? (successGrams / totalGrams) * 100 : 0
    const chartData = [
      {
        outcome: "Successes",
        grams: Math.round(successGrams * 10) / 10,
        fill: "var(--color-successes)",
      },
      {
        outcome: "Failures",
        grams: Math.round(failureGrams * 10) / 10,
        fill: "var(--color-failures)",
      },
    ]

    return { chartData, totalGrams, successRate }
  }, [prints])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Print Material Used</CardTitle>
        <CardDescription>Successful vs Failed Prints</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg" />}
            />
            <Pie
              data={chartData}
              dataKey="grams"
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
                          {totalGrams.toLocaleString()}g
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Used
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
          {successRate.toFixed(2)}% of used material was for successful prints
        </div>
      </CardContent>
    </Card>
  )
}
