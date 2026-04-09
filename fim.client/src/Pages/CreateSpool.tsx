import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../components/spools/AddSpoolForm';
import { EditSpoolForm } from '../components/spools/EditSpoolForm';
import { authFetch } from '../auth/authFetch';
import { Button } from "@/components/ui/button"
import { HandleDeletedSpools } from "@/components/spools/DeletedSpools"
import { TrashIcon } from "@/components/icons/mynaui-trash"
import { AllSpoolsGrouped } from "@/components/spools/SpoolsGrouped"
 
type Spool = components["schemas"]["SpoolDto"];
type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];
type GroupedSpool = components["schemas"]["SpoolGroupDto"]; 

export const CreateSpool = async (spool: CreateSpoolDto): Promise<Spool> => {
    return await authFetch("https://localhost:7035/spool", {
        method: "POST",
        body: JSON.stringify(spool)
    });
}

export default function GetSpools() {
    const [spools, setSpools] = useState<Spool[]>([]);
    const [editingSpool, setEditingSpool] = useState<Spool | null>(null);
    const [deletedSpools, setDeletedSpools] = useState<Spool[]>([]);
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const [groupedSpools, setGroupedSpools] = useState<GroupedSpool[]>([]);

    useEffect(() => {
        const loadAllGroupedSpool = async () => {
            try {
                const data: GroupedSpool[] = await authFetch(`https://localhost:7035/spool/GetGroupSpools`)
                setGroupedSpools(data);
            }
            catch (error){
                console.log("Failed to load from spools... " + (error));
            }
          
        }
        loadAllGroupedSpool();
    }, [])

    

    useEffect(() => {
        const loadSpools = async () => {
            try {
                const data: Spool[] = await authFetch("https://localhost:7035/spool");
                setSpools(data);
            } catch (error) {
                console.error("Error fetching spools:", error);
            }
        };

        loadSpools();
    }, []);

    useEffect(() => {
        const loadDeletedSpools = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/spool/GetAllDeletedSpools`)
                setDeletedSpools(data);
            }
            catch (error) {
                console.log("Failed to fetch from spools..." + error);
            }
        };
        loadDeletedSpools();
    }, []);

    const handleCreateSpool = async (spool: CreateSpoolDto) => {
        const newSpool = await CreateSpool(spool);
        setSpools(prev => [...prev, newSpool]);
    }

    const handleUpdateSpool = async (id: number | string, updated: Partial<Spool>) => {
        try {
            const updateSpool: Spool = await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "PATCH",
                body: JSON.stringify(updated)
            });
            setSpools(prev => prev.map(s => s.id === id ? updateSpool : s));
            setEditingSpool(null);
        } catch (error) {
            console.error("Error updating spool", error);
        }
    }

    const handleDeleteSpool = async (id: number | string) => {
        try {
            const data: Spool = await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "DELETE"
            });
            setSpools(prev => prev.filter(s => s.id !== id));
            setDeletedSpools(prev => [...prev, data]);
        }
        catch (error) {
                console.error("Error deleting spool", error);
        }
    }
    const handleShowDeleted = () => {
        setShowDeleted(prev => !prev);
    }
    const handleActiveFromComponent = (spool: Spool) => {
        setDeletedSpools(prev => prev.filter(prev => prev.id !== spool.id));
        setSpools(prev => [...prev, spool]);
    }
    //Uppdatera UI när vi plockar bort samt lägger till filament i vår groupedSpools lista
    const handleGroupedSpoolsActivate = (grouped: GroupedSpool, id: number) => {
        setGroupedSpools(prev => prev.filter(prev => prev.spools.filter(s => s.id != id)))
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100vw" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "50vw" }}>
                    <AllSpoolsGrouped
                        groupedSpools={groupedSpools}
                        onEditSpool={setEditingSpool}
                        onDelete={handleDeleteSpool}
                    ></AllSpoolsGrouped>
                </div>
                {showDeleted ? (
                    <div style={{ width: "30%", backgroundColor: "lightcoral", marginTop: "10px", border: "1px solid black", borderRadius: "10px" }}>
                        <Button className="bg-transparent" onClick={handleShowDeleted} style={{ margin: "5px" }}><TrashIcon className="size-8"></TrashIcon></Button>
                        <HandleDeletedSpools
                            spools={deletedSpools}
                            onActivateSpool={handleActiveFromComponent}
                        ></HandleDeletedSpools>
                    </div>
                ) : (
                        <div>
                            <Button className="bg-transparent" onClick={handleShowDeleted} style={{ margin: "5px" }} ><TrashIcon className="size-8"></TrashIcon>Deleted ({deletedSpools.length })</Button>
                        </div>
                    )
                }

            </div>
           
            <div style={{display: "flex"} }>
                {editingSpool ? (
                    <EditSpoolForm
                        spool={editingSpool}
                        onSubmit={handleUpdateSpool}
                        onCancel={() => setEditingSpool(null)}
                    />
                ) : (
                    <AddSpoolForm onSubmit={handleCreateSpool} />
                )}
            </div>
            <div style={{display: "flex"} }>
               
            </div>
            
        </div>
    )
}
