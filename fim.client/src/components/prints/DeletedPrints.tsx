import type { components } from "@/types/schema"

import { authFetch } from "@/auth/authFetch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"

type Print = components["schemas"]["PrintDto"]


type DeletePrintProps = {
    prints: Print[]
    onPrintsChanged: (print: Print) => void

    
}


export function HandleDeletedPrints({ prints, onPrintsChanged }: DeletePrintProps) {
    
    const deleteToActiveAsync = async (print: Print) => {
        try {
            const data = await authFetch(`https://localhost:7035/Print/UpdateStatus`, {
                method: "POST",
                body: JSON.stringify({
                    Id: print.id,
                    Status: print.status
                })
            })
            if (data !== null) {
                //Kolla vad som ifnna i data här
                /*setDeletedPrints(prev => prev.filter(p => p.id !== data.id));*/
                onPrintsChanged(print);
            }
        }
        catch (error) {
            console.log("Could not fetch from Print... " + error);
        }
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prints.map(p => (
                        <TableRow key={p.id}>
                            <TableCell>{ p.name}</TableCell>
                            <TableCell>{ p.createdAt}</TableCell>
                            <TableCell>
                                <Button className="bg-blue-500 text-black"
                                    onClick={() => deleteToActiveAsync(p)} 
                                >Activate</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    )













}