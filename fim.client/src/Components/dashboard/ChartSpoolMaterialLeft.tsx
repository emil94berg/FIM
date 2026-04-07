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

type SpoolDto = components["schemas"]["SpoolDto"]
type BucketKey = "Full" | "High" | "Medium" | "Low" | "VeryLow" | "Critical";
interface ChartRow {
  counts: BucketKey;
  count: number;
  spools: string[];
  fill: string;
}

export const description = "Spool Material Left"

const chartConfig = {
  count: { label: "Spools" },
  Full: { label: "Full 100%", color: "#15803d" },
  High: { label: "High 75% - 99%", color: "#4ade80" },
  Medium: { label: "Medium 50% - 74%", color: "#facc15" },
  Low: { label: "Low 25% - 49%", color: "#fb923c" },
  VeryLow: { label: "Very Low 10% - 24%", color: "#f97316" },
  Critical: { label: "Critical < 10%", color: "#dc2626" },
} satisfies ChartConfig;

export function ChartSpoolMaterialLeft({ spools }: { spools: SpoolDto[] }) {
  const chartData = useMemo<ChartRow[]>(() => {
    const counts: Record<BucketKey, string[]> = {
      Full: [],
      High: [],
      Medium: [],
      Low: [],
      VeryLow: [],
      Critical: [],
    };

    for (const spool of spools) {
      const totalWeight = Number(spool.totalWeight);
      const remainingWeight = Number(spool.remainingWeight);

      if (!Number.isFinite(totalWeight) || totalWeight <= 0 || !Number.isFinite(remainingWeight)) continue;

      const pct = (remainingWeight / totalWeight) * 100;
      if (pct >= 99.9) counts.Full.push(spool.identifier);
      else if (pct >= 75) counts.High.push(spool.identifier);
      else if (pct >= 50) counts.Medium.push(spool.identifier);
      else if (pct >= 25) counts.Low.push(spool.identifier);
      else if (pct >= 10) counts.VeryLow.push(spool.identifier);
      else counts.Critical.push(spool.identifier);
    }

    return [
      { counts: "Full", count: counts.Full.length, spools: counts.Full, fill: "var(--color-Full)" },
      { counts: "High", count: counts.High.length, spools: counts.High, fill: "var(--color-High)" },
      { counts: "Medium", count: counts.Medium.length, spools: counts.Medium, fill: "var(--color-Medium)" },
      { counts: "Low", count: counts.Low.length, spools: counts.Low, fill: "var(--color-Low)" },
      { counts: "VeryLow", count: counts.VeryLow.length, spools: counts.VeryLow, fill: "var(--color-VeryLow)" },
      { counts: "Critical", count: counts.Critical.length, spools: counts.Critical, fill: "var(--color-Critical)" },
    ]
  }, [spools]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spool Breakdown</CardTitle>
        <CardDescription>Material Left</CardDescription>
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
                  nameKey="counts"
                  formatter={(value, name, item) => {
                    const displayName = name === "VeryLow" ? "Very Low" : name
                    const spoolList = (item.payload as ChartRow).spools

                    return (
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">{displayName}</span>
                          <span className="font-medium">{value} {Number(value) === 1 ? "spool" : "spools"}</span>
                        </div>
                        {spoolList.map((id: string) => (
                          <span key={id} className="text-xs text-muted-foreground pl-2">• {id}</span>
                        ))}
                      </div>
                    )
                  }}
                />
              }
            />
            <Pie data={chartData} dataKey="count" nameKey="counts" />
            <ChartLegend
              content={<ChartLegendContent nameKey="counts" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
