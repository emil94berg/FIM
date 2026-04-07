import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { components } from "@/types/schema"

type Spool = components["schemas"]["SpoolDto"];

type AllSpoolsTableProps = {
    spools: Spool[]
    onDelete: (id: number | string) => void
    onEditSpool: (spool: Spool) => void

}








export function AllSpoolsTable({spools, onDelete, onEditSpool }: AllSpoolsTableProps) {

    const getRemainingWeightValue = (spool: Spool) => Number(spool.remainingWeight);

    return (
        <div>
            <h1>Create Spool</h1>
            <Table border={1}>
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
                    {spools.map(s => (
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
                                <Button className="bg-blue-500 text-black" onClick={() => onEditSpool(s)}>Edit</Button>
                                <Button className="bg-red-500 text-white" onClick={() => onDelete(s.id!)}>Delete</Button>
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
        </div>
    )
}