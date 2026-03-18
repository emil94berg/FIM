import { Button } from "@/Components/ui/button"
import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import { AddPrintForm } from "../Components/prints/AddPrintForm";
import { EditPrintForm } from "../Components/prints/EditPrintForm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, } from "@/Components/ui/table"
/*import SideBar from "../Components/SidebarMenu";*/



type Print = components["schemas"]["Print"];    



const handleSubmit = async (print: Print): Promise<Print> => {
    
    if (print.spoolId === 0) {
        alert("Please select a valid spool");
    }

   
        const response = await fetch("https://localhost:7035/Print", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(print)
        });
        if (!response.ok)
            throw new Error("Failed to create print");
        return await response.json() as Print;
};





export default function CreatePrint() {
    const [Print, setPrint] = useState<Print[]>([]);
    const [editingPrint, setEditingPrint] = useState<Print | null>(null);

    useEffect(() => {
        const loadPrint = async () => {
            try {
                const response = await fetch("https://localhost:7035/Print")
                if (!response.ok) throw new Error("Failed to fetch from Print API");
                const data: Print[] = await response.json();
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
            const response = await fetch(`https://localhost:7035/Print/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Failed to delete print");

            setPrint(prev => prev.filter(p => p.id !== id));
        }
        catch (error) {
            console.error("Error deleting print: ", error);
        }
    }
    const handleUpdatePrint = async (print: Print) => {
        try {
            const response = await fetch(`https://localhost:7035/Print/${print.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(print)
            });
            if (!response.ok) throw new Error("Failed to update print");

            const updatedPrint = await response.json();

            setPrint(prev => prev.map(p => (p.id === updatedPrint.id ? updatedPrint : p)));

            setEditingPrint(null);
        }
        catch (error) {
            console.error("Error updating print: ", error);
        }
    }
    const handleCreatePrint = async (print: Print) => {
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
                            <TableCell>{p.createdAt}</TableCell>
                            <TableCell>
                                {p.id !== undefined && (
                                    <Button variant="default" className="bg-blue-500 text-black" onClick={() => setEditingPrint(p)}>Edit</Button>
                                )}
                                {p.id !== undefined && (
                                    <Button variant="destructive" className="bg-red-500 text-white" onClick={() => handleDeletePrint(p.id!)}>Delete</Button>
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