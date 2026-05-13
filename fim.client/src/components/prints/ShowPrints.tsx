import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { components } from "@/types/schema"
import { StartPrintPopup } from "@/components/popUp/StartPrintPopup"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"

type Print = components["schemas"]["PrintDto"];

type RenderPrintsProps = {
    printsOrderedByStatus: (Print: Print[], status?: number) => Print[]
    statusMap: Record<number, string>
    Print: Print[]
    onEdit: (print: Print) => void
    onDelete: (print: Print) => void
    onStart: (print: Print) => void
    filterStatus?: number 
}


export function RenderPrints({ printsOrderedByStatus, statusMap, Print, onEdit, onDelete, onStart, filterStatus }: RenderPrintsProps)  {
    return (
            <Table border={1}>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Spool-Brand</TableHead>
                        <TableHead>Grams Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {printsOrderedByStatus(Print, filterStatus).map(p => (
                        <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.spool?.brand}</TableCell>
                            <TableCell>{p.gramsUsed}</TableCell>
                            <TableCell>{statusMap[p.status]}</TableCell>
                            <TableCell>
                                {new Date(p.createdAt).toLocaleString("sv-SE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </TableCell>
                            <TableCell>
                                {p.status !== 1 && (
                                    <StartPrintPopup
                                        print={p}
                                        onStarted={onStart}
                                    ><Button className="bg-green-500 text-white">Start Print</Button>
                                    </StartPrintPopup>
                                )}
                                {p.id !== undefined && (
                                    <Button variant="default" className="bg-blue-500 text-white" onClick={() => onEdit(p)}>Edit</Button>
                                )}
                                {p.id !== undefined && (
                                    <ConfirmDialog title="Delete Print"
                                        description={`Are you sure you want to delete ${p.name ?? "this item"}?`}
                                        confirmText="Delete"
                                        confirmButtonClassName="bg-red-500 text-white"
                                        cancelButtonClassName="bg-blue-500 text-white"
                                        onConfirm={() => onDelete(p)}>
                                        <Button variant="destructive" className="bg-red-500 text-white">Delete</Button>
                                    </ConfirmDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
      
    )
}