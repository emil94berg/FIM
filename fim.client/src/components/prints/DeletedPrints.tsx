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
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"


type Print = components["schemas"]["PrintDto"]


type DeletePrintProps = {
    prints: Print[]
    onPrintsChanged: (print: Print) => void
    onHandlePrintsHardDelete: (print: Print) => void
}


export function HandleDeletedPrints({ prints, onPrintsChanged, onHandlePrintsHardDelete }: DeletePrintProps) {
    
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
                onPrintsChanged(print);
            }
        }
        catch (error) {
            console.log("Could not fetch from Print... " + error);
        }
    }
    const HandleHardDeleteAsync = async (print: Print) => {
        try {
            await authFetch("https://localhost:7035/Print/HardDeletePrint", {
                method: "DELETE",
                body: JSON.stringify(print)
            })
            onHandlePrintsHardDelete(print);
        }
        catch (error) {
            console.log("Failed to fetch from print..." + error)
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
                                <ConfirmDialog
                                    title={`Delete ${p.name}?`}
                                    description={`This action cannot be undone!`}
                                    confirmText={"Delete"}
                                    cancelText={"Cancel"}
                                    confirmButtonClassName={"bg-red-500 text-white"}
                                    cancelButtonClassName={"bg-gray-400 text-white"}
                                    onConfirm={() => HandleHardDeleteAsync(p)}
                                >
                                <Button className="bg-red-500">Delete</Button></ConfirmDialog>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    )













}