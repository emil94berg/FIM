import { useState, useEffect, useContext } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../components/spools/AddSpoolForm';
import { EditSpoolForm } from '../components/spools/EditSpoolForm';
import { authFetch } from '../auth/authFetch';
import { Button } from "@/components/ui/button"
import { HandleDeletedSpools } from "@/components/spools/DeletedSpools"
import { TrashIcon } from "@/components/icons/mynaui-trash"
import { AllSpoolsGrouped } from "@/components/spools/SpoolsGrouped"
import { ExistingSpoolContext, defaultSpool } from "@/components/context/AddSpoolContextType"
import { CatalogList } from "@/components/FilamentCatalog"



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
    const [editingSpool, setEditingSpool] = useState<Spool | null>(null);
    const [deletedSpools, setDeletedSpools] = useState<Spool[]>([]);
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const [groupedSpools, setGroupedSpools] = useState<GroupedSpool[]>([]);
    const { setFormData } = useContext(ExistingSpoolContext);
    const [addingSpool, setAddingSpool] = useState(false);
    const [activeView, setActiveView] = useState<"inventory" | "catalog">("inventory");

    useEffect(() => {
        const loadAllGroupedSpool = async () => {
            try {
                const data: GroupedSpool[] = await authFetch(`https://localhost:7035/spool/GetGroupSpools`)
                setGroupedSpools(data);
            }
            catch (error) {
                console.log("Failed to load from spools... " + (error));
            }

        }
        loadAllGroupedSpool();
    }, [])


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
        if (!groupedSpools.some(sg => sg.identifier == newSpool.identifier)) {
            const newSpoolGroup: GroupedSpool = { identifier: newSpool.identifier, spools: [newSpool] }
            setGroupedSpools(prev => [...prev, newSpoolGroup])
        }
        else {
            setGroupedSpools(prev => prev.map(gs => {
                if (gs.identifier !== newSpool.identifier) return gs
                return {
                    ...gs,
                    spools: [...gs.spools, newSpool]
                }
            }
            ))
        }

    }

    const handleUpdateSpool = async (id: number | string, updated: Partial<Spool>) => {
        try {
            const updateSpool: Spool = await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "PATCH",
                body: JSON.stringify(updated)
            });
            setGroupedSpools(prev => prev.map(gs => ({
                ...gs,
                spools: gs.spools.map(s => s.id === id ? updateSpool : s)
            })));



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
            setDeletedSpools(prev => [...prev, data]);
        }
        catch (error) {
            console.error("Error deleting spool", error);
        }
    }
 
    const handleActiveFromComponent = (spool: Spool) => {
        setDeletedSpools(prev => prev.filter(prev => prev.id !== spool.id));

        if (!groupedSpools.some(sg => sg.identifier == spool.identifier)) {
            const newSpoolGroup: GroupedSpool = { identifier: spool.identifier, spools: [spool] }
            setGroupedSpools(prev => [...prev, newSpoolGroup])
        }
        else {
            setGroupedSpools(prev => prev
                .map(gs => {
                    if (gs.identifier !== spool.identifier) return gs
                    return {
                        ...gs,
                        spools: [...gs.spools, spool]
                    };
                })
            )
        }
    }
    //Uppdatera UI när vi plockar bort samt lägger till filament i vår groupedSpools lista
    const handleGroupedSpoolsActivate = (grouped: GroupedSpool, id: number) => {
        setGroupedSpools(prev =>
            prev
                .map(gs => {
                    if (gs.identifier !== grouped.identifier) return gs;
                    return {
                        ...gs,
                        spools: gs.spools.filter(s => s.id !== id)
                    };
                })
                .filter(gs => gs.spools.length > 0)
        );
    };

    const onHandleExisting = (spool: CreateSpoolDto) => {
        setAddingSpool(true);
        setFormData(spool);
    }
    const onHardDeleteSpool = (spool: Spool) => {
        setGroupedSpools(prev => 
            prev.map(gs => {
                if (gs.identifier !== spool.identifier) return gs;
                return {
                    ...gs,
                    spools: gs.spools.filter(s => s.id !== spool.id)
                }
            }))
        setDeletedSpools(prev => prev.filter(s => s.id !== spool.id))
    }

    return (
        <div className="gap-4">
            <div className="bg-blue-500 p-4 rounded gap-4 m-4">
                <div className="gap-4 m-4">
                    <h1 className="text-3xl font-bold mb-4 text-white">Spools</h1>
                </div>
                <div className="flex flex-row gap-4 m-4">
                    <Button className={activeView === "inventory" ? "bg-gray-500 text-white" : "bg-green-500 text-white"} onClick={() => setActiveView("inventory")}>Inventory</Button>
                    <Button className={activeView === "catalog" ? "bg-gray-500 text-white" : "bg-green-500 text-white"} onClick={() => setActiveView("catalog")}>Catalog</Button>
                    <Button className="bg-green-500 text-white" onClick={() => {
                        setFormData(defaultSpool);
                        setAddingSpool(true)}}>Add Spool</Button>
                    <Button className="bg-red-500 text-white" onClick={() => setShowDeleted(prev => !prev)}><TrashIcon className="size-8"></TrashIcon>Deleted ({deletedSpools.length})</Button>
                </div>
            </div>
            {activeView === "inventory" ? (
                <div className="flex flex-col gap-4 m-4 bg-slate-200 p-4 rounded">
                    <AllSpoolsGrouped
                        groupedSpools={groupedSpools}
                        onEditSpool={setEditingSpool}
                        onDelete={handleDeleteSpool}
                        handleGrouped={handleGroupedSpoolsActivate}
                        onSetExisting={onHandleExisting}
                    ></AllSpoolsGrouped>
                </div>
            ) : (
                <div className="gap-4 m-4 bg-slate-200 p-4 rounded">
                    <CatalogList />
                </div>
            )}

            
            <div style={{ display: "flex" }}>
                {editingSpool ? (
                    <EditSpoolForm
                        spool={editingSpool}
                        onSubmit={handleUpdateSpool}
                        onCancel={() => setEditingSpool(null)}
                    />
                ) : addingSpool ? (
                    <AddSpoolForm onSubmit={handleCreateSpool} onCancel={() => setAddingSpool(false)} />
                ) : showDeleted ? (
                    <HandleDeletedSpools
                        spools={deletedSpools}
                        onActivateSpool={handleActiveFromComponent}
                        onHardDeleteSpool={onHardDeleteSpool}
                        onCancel={() => setShowDeleted(false)}
                    ></HandleDeletedSpools>
                ) : null}
            </div>
        </div>
    )
}