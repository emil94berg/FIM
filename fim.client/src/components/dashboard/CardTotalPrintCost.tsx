import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { components } from "@/types/schema"

type PrintDto = components["schemas"]["PrintDto"]

export function CardTotalPrintCost({ prints }: { prints: PrintDto[] }) {
    const totalCost = useMemo(() => {
        let total = 0
        for (const print of prints) {
            const spool = print.spool
            if (!spool) continue
            const grams = Number(print.gramsUsed)
            const totalWeight = Number(spool.totalWeight)
            const spoolCost = Number(spool.spoolCost)
            if (
                Number.isFinite(grams) && grams > 0 &&
                Number.isFinite(totalWeight) && totalWeight > 0 &&
                Number.isFinite(spoolCost) && spoolCost > 0
            ) {
                total += (grams / totalWeight) * spoolCost
            }
        }
        return total
    }, [prints])

    return (
        <Card className="w-fit gap-4 mb-4">
            <CardHeader>
                <CardTitle>Total Print Cost</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
                {totalCost.toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
            </CardContent>
        </Card>
    )
}
