import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../components/spools/AddSpoolForm';
import { EditSpoolForm } from '../components/spools/EditSpoolForm';
import { authFetch } from '../auth/authFetch';
import { AllSpoolsTable } from "@/components/spools/AllSpoolsTable"

type Spool = components["schemas"]["SpoolDto"];
type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

export const CreateSpool = async (spool: CreateSpoolDto): Promise<Spool> => {
    return await authFetch("https://localhost:7035/spool", {
        method: "POST",
        body: JSON.stringify(spool)
    });
}

export default function GetSpools() {
    const [spools, setSpools] = useState<Spool[]>([]);
    const [editingSpool, setEditingSpool] = useState<Spool | null>(null);
    const [deletedPrints, setDeletedPrints] = useState<Spool[]>([]);

    

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
                setDeletedPrints(data);
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
            await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "DELETE"
            });
            setSpools(prev => prev.filter(s => s.id !== id));
        }
        catch (error) {
                console.error("Error deleting spool", error);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{display: "flex"}}>
                <AllSpoolsTable
                    onDelete={handleDeleteSpool}
                    spools={spools}
                    onEditSpool={setEditingSpool}
                ></AllSpoolsTable>
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
        </div>
    )
}
