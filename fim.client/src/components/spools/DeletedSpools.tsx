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

type Spool = components["schemas"]["SpoolDto"];

type DeletedSpoolsProps = {
    spools: Spool[]
    onActivateSpool: (s: Spool) => void;
    onHardDeleteSpool: (spool: Spool) => void;
}




export function HandleDeletedSpools({ spools, onActivateSpool, onHardDeleteSpool }: DeletedSpoolsProps) {
    

    const ChangeDeletedStatusAsync = async (spool: Spool) => {
        try {
            const data: Spool = await authFetch(`https://localhost:7035/Spool/ChangeDeletedStatus`, {
                method: "PUT",
                body: JSON.stringify(spool)
            });
            onActivateSpool(data);
        }
        catch (error) {
            console.log("Could not fetch from spools..." + error);
        }
    }
    const HandleHardDeleteAsync = async (spool: Spool) => {
        try {
            await authFetch(`https://localhost:7035/Spool/HardDeleteSpool`, {
                method: "DELETE",
                body: JSON.stringify(spool)
            });
            onHardDeleteSpool(spool);
            /*onActivateSpool(data);*/
        }
        catch (error) {
            console.log("Could not fetch from spools..." + error);
        }
    }


    return (
        <div>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}