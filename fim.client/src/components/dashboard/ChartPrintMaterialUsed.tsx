"use client"
import { useMemo } from "react"
import type { components } from "@/types/schema"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type PrintDto = components["schemas"]["PrintDto"]

const MATERIAL_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
]

interface ChartRow {
  material: string
  count: number
  fill: string
}

export function ChartPrintMaterialUsed({ prints }: { prints: PrintDto[] }) {
  const { chartData, chartConfig } = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const print of prints) {
      const material = print.spool?.material
      if (!material) continue
      counts[material] = (counts[material] ?? 0) + 1
    }

    const materials = Object.keys(counts)
    const data: ChartRow[] = materials.map((material, i) => ({
      material,
      count: counts[material],
      fill: MATERIAL_COLORS[i % MATERIAL_COLORS.length],
    }))

    const config: ChartConfig = {
      count: { label: "Prints" },
      ...Object.fromEntries(
        materials.map((material, i) => [
          material,
          { label: material, color: MATERIAL_COLORS[i % MATERIAL_COLORS.length] },
        ])
      ),
    }

    return { chartData: data, chartConfig: config }
  }, [prints])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Print Breakdown</CardTitle>
        <CardDescription>Material Types Used</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg"
                  nameKey="material"
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium">
                        {value} {Number(value) === 1 ? "print" : "prints"}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie data={chartData} dataKey="count" nameKey="material" />
            <ChartLegend
              content={<ChartLegendContent nameKey="material" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
