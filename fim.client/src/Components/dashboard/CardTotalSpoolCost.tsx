import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { components } from "@/types/schema"

type SpoolDto = components["schemas"]["SpoolDto"]

export function CardTotalSpoolCost({ spools }: { spools: SpoolDto[] }) {
    const totalCost = useMemo(() => {
        let total = 0
        for (const spool of spools) {
            const cost = Number(spool.spoolCost)
            if (Number.isFinite(cost) && cost > 0) total += cost
        }
        return total
    }, [spools])

    return (
        <Card className="w-fit gap-4 mb-4">
            <CardHeader>
                <CardTitle>Total Spool Cost</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
                {totalCost.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
            </CardContent>
        </Card>
    )
}