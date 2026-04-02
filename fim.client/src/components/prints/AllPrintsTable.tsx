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

type Print = components["schemas"]["PrintDto"]


type AllPrintsListProps = {
    Print: Print[]
    statusMap: Record<number, string>
    onEdit: (print: Print) => void
    onDelete: (print: Print) => void
    onStart: (print: Print) => void
}

export function AllPrintsTable({ Print, statusMap, onEdit, onDelete, onStart }: AllPrintsListProps) {


    return (
        <div>
            <Table border={1}>
                <TableHeader>
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
                    {Print.map(p => (
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
                                {p.id !== undefined && (
                                    <StartPrintPopup
                                        print={p}
                                        onStarted={onStart}
                                    ><Button className="bg-green-500" >Start Print</Button>
                                    </StartPrintPopup>
                                )}
                                {p.id !== undefined && (
                                    <Button variant="default" className="bg-blue-500 text-black" onClick={() => onEdit(p)}>Edit</Button>
                                )}
                                {p.id !== undefined && (
                                    <ConfirmDialog title="Delete Print"
                                        description={`Are you sure you want to delete ${p.name ?? "this item"}?`}
                                        confirmText="Delete"
                                        confirmButtonClassName="bg-red-500 text-white"
                                        cancelButtonClassName="bg-blue-500 text-black"
                                        onConfirm={() => onDelete(p)}>
                                        <Button variant="destructive" className="bg-red-500 text-white">Delete</Button>
                                    </ConfirmDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
       
    )
}