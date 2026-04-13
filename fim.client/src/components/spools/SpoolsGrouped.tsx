import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {  ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { components } from "@/types/schema"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"

type Spool = components["schemas"]["SpoolDto"];
type GroupedSpool = components["schemas"]["SpoolGroupDto"];
type CreateSpool = components["schemas"]["CreateSpoolDto"];
type AllSpoolsGroupedProps = {
    groupedSpools: GroupedSpool[]
    onEditSpool: (s: Spool) => void
    onDelete: (id: number | string) => void
    handleGrouped: (groupSpools: GroupedSpool, id: number) => void
    onSetExisting: (existingSpool: CreateSpool) => void
}


export function AllSpoolsGrouped({ groupedSpools, onEditSpool, onDelete, handleGrouped, onSetExisting }: AllSpoolsGroupedProps)  {
   
    const getRemainingWeightValue = (spool: Spool) => Number(spool.remainingWeight);

    return (
        <div>
            {groupedSpools.map(gs => (
                <Collapsible key={gs.identifier}>
                    <div className="flex flex-row">
                        <CollapsibleTrigger asChild>
                            <Button size="icon"
                                className="bg-transparent">
                                <ChevronsUpDown></ChevronsUpDown>
                                <span className="sr-only">Toggle details</span>
                            </Button>
                        </CollapsibleTrigger>
                        <span>{gs.identifier}</span>
                    </div>
                    <div className="flex flex-col">
                        {gs.spools.map(s => (
                            <div key={s.id} className="flex flex-row">
                                <CollapsibleContent className="flex flex-col gap-2">
                                    <Table className="bg-gray-100">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Brand</TableHead>
                                                <TableHead>Material</TableHead>
                                                <TableHead>Color</TableHead>
                                                <TableHead>Diameter</TableHead>
                                                <TableHead>Total Weight</TableHead>
                                                <TableHead>Remaining</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            
                                                <TableRow key={s.id}>
                                                    <TableCell>{s.brand}</TableCell>
                                                    <TableCell>{s.material}</TableCell>
                                                    <TableCell>{s.colorName}</TableCell>
                                                    <TableCell>{s.diameter}</TableCell>
                                                    <TableCell>{s.totalWeight}</TableCell>
                                                    <TableCell>
                                                        {getRemainingWeightValue(s) < 0 ? (
                                                            <span className="font-semibold text-red-600">
                                                                {s.remainingWeight} (Warning: Negative)
                                                            </span>
                                                        ) : (
                                                            s.remainingWeight
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(s.createdAt).toLocaleString("sv-SE", {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit"
                                                        })}
                                                    </TableCell>
                                                <TableCell>
                                                    <Button className="bg-green-500" onClick={() => onSetExisting(s)}>+</Button>
                                                    <Button className="bg-blue-500 text-black" onClick={() => onEditSpool(s)}>Edit</Button>
                                                        <ConfirmDialog
                                                            onConfirm={async () => { await onDelete(s.id); handleGrouped(gs, Number(s.id)) }}
                                                            title={`Delete ${s.identifier}`}
                                                            description="You activate your deleted spools for up to 1 week after removal"
                                                            confirmText="Delete"
                                                            confirmButtonClassName="bg-red-500 text-white"
                                                            cancelButtonClassName="bg-red-500 text-white"
                                                            ><Button className="bg-red-500 text-white">Delete</Button>
                                                        </ConfirmDialog>
                                                    </TableCell>
                                                </TableRow>

                                         
                                        </TableBody>
                                    </Table>
                                </CollapsibleContent>
                            </div>
                        ))}
                    </div>
                </Collapsible>
            ))}
        </div>
    )
}