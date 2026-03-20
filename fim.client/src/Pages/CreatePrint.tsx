import { Button } from "@/components/ui/button"
import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import { AddPrintForm } from "../components/prints/AddPrintForm";
import { EditPrintForm } from "../components/prints/EditPrintForm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { authFetch } from "../auth/authFetch"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"
/*import SideBar from "../components/SidebarMenu";*/



type Print = components["schemas"]["PrintDto"];  
type CreatePrindDto = components["schemas"]["CreatePrintDto"]; 



const handleSubmit = async (print: CreatePrindDto): Promise<Print> => {
    
    if (print.spoolId === 0) {
        alert("Please select a valid spool");
    }

    return await authFetch("https://localhost:7035/Print", {
            method: "POST",
            body: JSON.stringify(print)
        });
};





export default function CreatePrint() {
    const [Print, setPrint] = useState<Print[]>([]);
    const [editingPrint, setEditingPrint] = useState<Print | null>(null);

    useEffect(() => {
        const loadPrint = async () => {
            try {
                const data: Print[] = await authFetch("https://localhost:7035/Print");
                setPrint(data);
            }
            catch (error) {
                console.error("Error fetching print: ", error);
            }
        };
        loadPrint();
    }, []);


    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }
    const handleDeletePrint = async (id: number | string) => {
        try {
            await authFetch(`https://localhost:7035/Print/${id}`, {
                method: "DELETE"
            });
            
            setPrint(prev => prev.filter(p => p.id !== id));
        }
        catch (error) {
            console.error("Error deleting print: ", error);
        }
    }
    const handleUpdatePrint = async (print: Print) => {
        try { 
            const data: Print = await authFetch(`https://localhost:7035/Print/${print.id}`, {
                method: "PATCH",
                body: JSON.stringify(print)
            });

            setPrint(prev => prev.map(p => (p.id === data.id ? data : p)));
            setEditingPrint(null);
        }
        catch (error) {
            console.error("Error updating print: ", error);
        }
    }
    const handleCreatePrint = async (print: CreatePrindDto) => {
        const newPrint = await handleSubmit(print);
        setPrint(prev => [...prev, newPrint]);
    }
    

    return (
        
        <div style={{ display: "flex", flexDirection: "column" }}>
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
                        <TableRow key={ p.id }>
                            <TableCell>{ p.name }</TableCell>
                            <TableCell>{ p.spool?.brand }</TableCell>
                            <TableCell>{ p.gramsUsed }</TableCell>
                            <TableCell>{statusMap[p.status] }</TableCell>
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
                                    <Button variant="default" className="bg-blue-500 text-black" onClick={() => setEditingPrint(p)}>Edit</Button>
                                )}
                                {p.id !== undefined && (
                                    <ConfirmDialog title="Delete Print"
                                        description={`Are you sure you want to delete ${p.name ?? "this item"}?`} 
                                        confirmText="Delete"
                                        confirmButtonClassName="bg-red-500 text-white"
                                        cancelButtonClassName="bg-blue-500 text-black"
                                        onConfirm={() => handleDeletePrint(p.id)}>
                                        <Button variant="destructive" className="bg-red-500 text-white">Delete</Button>
                                    </ConfirmDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingPrint ? (
                <EditPrintForm
                    print={editingPrint}
                    onSubmit={handleUpdatePrint}
                    onCancel={() => setEditingPrint(null)}></EditPrintForm>
            ) : (
                    <AddPrintForm onSubmit={handleCreatePrint}></AddPrintForm>
            )}


            
            
        </div>
    )
}