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
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


type Print = components["schemas"]["PrintDto"]


type DeletePrintProps = {
    prints: Print[]
    onPrintsChanged: (print: Print) => void
    onHandlePrintsHardDelete: (print: Print) => void
    onCancel: () => void;
}


export function HandleDeletedPrints({ prints, onPrintsChanged, onHandlePrintsHardDelete, onCancel }: DeletePrintProps) {
    
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
                toast.success("Print restored successfully");
            }
        }
        catch (error) {
            console.log("Could not fetch from Print... " + error);
            toast.error("Failed to restore print");
        }
    }
    const HandleHardDeleteAsync = async (print: Print) => {
        try {
            await authFetch("https://localhost:7035/Print/HardDeletePrint", {
                method: "DELETE",
                body: JSON.stringify(print)
            })
            onHandlePrintsHardDelete(print);
            toast.success("Print permanently deleted");
        }
        catch (error) {
            console.log("Failed to fetch from print..." + error);
            toast.error("Failed to permanently delete print");
        }
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) {
                onCancel()
            }
        }}>
            <DialogContent className="bg-white text-black max-w-4xl">
                <div className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>Deleted Prints</DialogTitle>
                    <DialogDescription>Here you can see all deleted prints. You can either activate them again or delete them permanently.</DialogDescription>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    )













}