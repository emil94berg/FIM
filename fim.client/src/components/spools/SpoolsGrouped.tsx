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
                <Collapsible key={gs.identifier} className="mb-3">
                    
                    <div className="border-2 border-gray-400 rounded">
                        <CollapsibleTrigger className="bg-transparent w-full flex items-center gap-2 px-3 py-2">
                            <ChevronsUpDown className="h-4 w-4"/>
                            
                            <span>{gs.identifier}</span>
                        </CollapsibleTrigger>
                        <div className="flex flex-row">
                            <CollapsibleContent className="flex flex-col  w-full">
                                <Table className="border rounded bg-gray-50">
                                    <TableHeader className="bg-gray-100">
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
                                        {gs.spools.map(s => (
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
                                            <Button className="bg-green-500 text-white" onClick={() => onSetExisting(s)}>Copy</Button>
                                            <Button className="bg-blue-500 text-white" onClick={() => onEditSpool(s)}>Edit</Button>
                                                <ConfirmDialog
                                                    onConfirm={async () => { await onDelete(s.id); handleGrouped(gs, Number(s.id)) }}
                                                    title={`Delete ${s.identifier}`}
                                                    description="This will remove the spool, you can later reactivate it in the deleted spools tab. Do you want to proceed?"
                                                    confirmText="Delete"
                                                    confirmButtonClassName="bg-red-500 text-white"
                                                    cancelButtonClassName="bg-blue-500 text-white"
                                                    ><Button className="bg-red-500 text-white">Delete</Button>
                                                </ConfirmDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </CollapsibleContent>
                        </div>
                    </div>
                </Collapsible>
            ))}
        </div>
    )
}