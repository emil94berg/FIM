import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import { AddPrintForm } from "../Components/prints/AddPrintForm";
import { EditPrintForm } from "../Components/prints/EditPrintForm";
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
            <table border={1}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Spool-Brand</th>
                        <th>Grams Used</th>
                        <th>Status</th>
                        <th>Created at</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Print.map(p => (
                        <tr key={ p.id }>
                            <td>{ p.name }</td>
                            <td>{ p.spool?.brand }</td>
                            <td>{ p.gramsUsed }</td>
                            <td>{statusMap[p.status] }</td>
                            <td>{p.createdAt}</td>
                            <td>
                                {p.id !== undefined && (
                                    <button onClick={() => setEditingPrint(p)}>Edit</button>
                                )}
                                {p.id !== undefined && (
                                    <button onClick={() => handleDeletePrint(p.id!)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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