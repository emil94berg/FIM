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

type Spool = components["schemas"]["SpoolDto"];

type DeletedSpoolsProps = {
    spools: Spool[]
    onActivateSpool: (s: Spool) => void;
    onHardDeleteSpool: (spool: Spool) => void;
    onCancel: () => void;
}




export function HandleDeletedSpools({ spools, onActivateSpool, onHardDeleteSpool, onCancel }: DeletedSpoolsProps) {
    

    const ChangeDeletedStatusAsync = async (spool: Spool) => {
        try {
            const data: Spool = await authFetch(`https://localhost:7035/Spool/ChangeDeletedStatus`, {
                method: "PUT",
                body: JSON.stringify(spool)
            });
            onActivateSpool(data);
            toast.success("Spool restored successfully");
        }
        catch (error) {
            console.log("Could not fetch from spools..." + error);
            toast.error("Failed to restore spool");
        }
    }
    const HandleHardDeleteAsync = async (spool: Spool) => {
        try {
            await authFetch(`https://localhost:7035/Spool/HardDeleteSpool`, {
                method: "DELETE",
                body: JSON.stringify(spool)
            });
            onHardDeleteSpool(spool);
            toast.success("Spool permanently deleted");
            /*onActivateSpool(data);*/
        }
        catch (error) {
            console.log("Could not fetch from spools..." + error);
            toast.error("Failed to permanently delete spool");
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
                    <DialogTitle>Deleted Spools</DialogTitle>
                    <DialogDescription>Here you can see all deleted spools. You can either activate them again or delete them permanently.</DialogDescription>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Identifier</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {spools.map(s => (
                            <TableRow key={s.id}>
                                <TableCell>{s.identifier}</TableCell>
                                <TableCell>{new Date(s.createdAt).toLocaleString("sv-SE", {
                                    year: "2-digit",
                                    month: "2-digit",
                                    day: "2-digit"
                                })}</TableCell>
                                <TableCell>
                                    <div className="flex gap-4">
                                        <Button className="bg-blue-500 text-black"
                                            onClick={() => ChangeDeletedStatusAsync(s)}
                                        >Activate</Button>
                                        <ConfirmDialog
                                            title={`Delete ${s.identifier}?`}
                                            description={`This action cannot be undone!`}
                                            confirmText={"Delete"}
                                            cancelText={"Cancel"}
                                            confirmButtonClassName={"bg-red-500 text-white"}
                                            cancelButtonClassName={"bg-gray-400 text-white"}
                                            onConfirm={() => HandleHardDeleteAsync(s)}
                                        ><Button className="bg-red-500 text-white">Delete</Button>
                                        </ConfirmDialog>
                                    </div>
                                    
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