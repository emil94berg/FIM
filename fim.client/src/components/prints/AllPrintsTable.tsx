import { useState } from "react"
import type { components } from "@/types/schema"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"
import { StartPrintPopup } from "@/components/popUp/StartPrintPopup"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RenderPrints } from "@/components/prints/ShowPrints"

type Print = components["schemas"]["PrintDto"]


type AllPrintsListProps = {
    Print: Print[]
    statusMap: Record<number, string>
    onEdit: (print: Print) => void
    onDelete: (print: Print) => void
    onStart: (print: Print) => void
}

export function AllPrintsTable({ Print, statusMap, onEdit, onDelete, onStart }: AllPrintsListProps) {
    const [activeView, setActiveView] = useState<"allPrints" | "finishedPrints">("allPrints");

    const printsOrderedByStatus = (prints: Print[], status?: number) => {
        const orderNumber = [0, 1, 3, 4, 2] //Pending = 0, Printing = 1, Completed = 2, Failed = 3, Cancelled = 4
        const newPrints = prints.sort((a, b) => orderNumber.indexOf(a.status) - orderNumber.indexOf(b.status))
        if (status === 2) return newPrints.filter(p => p.status !== status)
        return newPrints.filter(p => p.status === 2)
        
        
    }

    return (
        <div className="bg-gray-50 p-4 rounded">
            <Tabs className="mb-2" value={activeView} onValueChange={(value) => setActiveView(value as "allPrints" | "finishedPrints") }>
                <TabsList variant="line">
                    <TabsTrigger value="allPrints">Prints</TabsTrigger>
                    <TabsTrigger value="finishedPrints">Finished Prints</TabsTrigger>
                </TabsList>
            </Tabs>
            {activeView === "allPrints" &&
                <RenderPrints
                    printsOrderedByStatus={printsOrderedByStatus}
                    statusMap={statusMap}
                    Print={Print}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStart={onStart}
                    filterStatus={2}
                ></RenderPrints>
            }
            {activeView === "finishedPrints" &&
                <RenderPrints
                    printsOrderedByStatus={printsOrderedByStatus}
                    statusMap={statusMap}
                    Print={Print}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStart={onStart}
                ></RenderPrints>
            }
        </div>
       
    )
}