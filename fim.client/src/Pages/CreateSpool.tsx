import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../Components/spools/AddSpoolForm';
import { EditSpoolForm } from '../Components/spools/EditSpoolForm';
import { authFetch } from '../auth/authFetch';

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
        <div>
            <h1>Create Spool</h1>
            <p>This is the page to create a new spool.</p>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Material</th>
                        <th>Color</th>
                        <th>Diameter</th>
                        <th>Total Weight</th>
                        <th>Remaining Weight</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {spools.map(s => (
                    <tr key={s.id}>
                        <td>{s.brand}</td>
                        <td>{s.material}</td>
                        <td>{s.color}</td>
                        <td>{s.diameter}</td>
                        <td>{s.totalWeight}</td>
                        <td>{s.remainingWeight}</td>
                        <td>{s.createdAt}</td>
                        <td>
                            <button onClick={() => setEditingSpool(s)}>Edit</button>
                            <button onClick={() => handleDeleteSpool(s.id!)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
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
    )
}
