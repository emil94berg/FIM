import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import { AddPrintForm } from "../components/prints/AddPrintForm";
import { EditPrintForm } from "../components/prints/EditPrintForm";
import { authFetch } from "../auth/authFetch"
import { HandleDeletedPrints } from "@/components/prints/DeletedPrints"
import { AllPrintsTable } from "@/components/prints/AllPrintsTable"
import { Button } from "../components/ui/button";
import { TrashIcon } from "@/components/icons/mynaui-trash"



type Print = components["schemas"]["PrintDto"];  
type CreatePrindDto = components["schemas"]["CreatePrintDto"]; 


type UpdatePrintResponse = Print | { print: Print; warning?: string };


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
    const [print, setPrint] = useState<Print[]>([]);
    const [editingPrint, setEditingPrint] = useState<Print | null>(null);
    const [deletedPrints, setDeletedPrints] = useState<Print[]>([]);
    const [showDeleted, setShowDeleted] = useState<boolean>(false);


    useEffect(() => {
        const loadPrints = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/Print/GetAllDeletedPrints`)
                setDeletedPrints(data);
            }
            catch (error) {
                console.log("Failed to fetch from Prints..." + error);
            }
        };
        loadPrints();
    }, []);


    const handleStartPrint = (updatedPrint: Print) => {
        setPrint(prev =>
            prev.map(p => p.id === updatedPrint.id ? updatedPrint : p)
        );
    };
    

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
        3: "Failed",
        4: "Cancelled"
    }

    const handleDeletePrint = async (print: Print) => {
        try {
            await authFetch(`https://localhost:7035/Print/${print.id}`, {
                method: "DELETE"
            });
            
            setPrint(prev => prev.filter(p => p.id !== print.id));
            setDeletedPrints(prev => [...prev, print]);
        }
        catch (error) {
            console.error("Error deleting print: ", error);
        }
    }

    const handleUpdatePrint = async (print: Print) => {
        try { 
            const data: UpdatePrintResponse = await authFetch(`https://localhost:7035/Print/${print.id}`, {
                method: "PATCH",
                body: JSON.stringify(print)
            });

            const updatedPrint = "print" in data ? data.print : data;
            const warning = "print" in data ? data.warning : undefined;

            if (warning) {
                alert(warning);
            }

            setPrint(prev => prev.map(p => (p.id === updatedPrint.id ? updatedPrint : p)));
            setEditingPrint(null);
        }
        catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Error updating print.");
        }
    }

    const handleCreatePrint = async (print: CreatePrindDto) => {
        try {
            const newPrint = await handleSubmit(print);
            setPrint(prev => [...prev, newPrint]);
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Failed to create print.");
        }
    }
    const handleDeleteFromComponent = async (print: Print) => {
        setDeletedPrints(prev => prev.filter(prev => prev.id !== print.id));
        setPrint(prev => [...prev, print]);

    }
    const handleSetShowDeleted = () => {
        setShowDeleted(prev => !prev);
    }
    

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "50%" }}>
                    
                    <AllPrintsTable
                        Print={print}
                        statusMap={statusMap}
                        onDelete={handleDeletePrint}
                        onEdit={setEditingPrint}
                        onStart={handleStartPrint}
                    ></AllPrintsTable>
                </div>

                {showDeleted ? (
                    <div style={{ width: "30%", backgroundColor: "lightcoral", marginTop: "10px", border:"1px solid black",borderRadius: "10px"}}>
                        <Button className="bg-transparent" onClick={handleSetShowDeleted} style={{ margin: "5px" }}><TrashIcon className="size-8"></TrashIcon>Deleted</Button>
                        <HandleDeletedPrints
                            prints={deletedPrints}
                            onPrintsChanged={handleDeleteFromComponent}
                        ></HandleDeletedPrints>
                    </div>
                ) : (
                        <div style={{ marginTop: "10px" }}>
                            <Button className="bg-transparent" onClick={handleSetShowDeleted}><TrashIcon className="size-8"></TrashIcon>Deleted ({deletedPrints.length})</Button>
                    </div>
                        
                )}
            </div>
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