import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../Components/spools/AddSpoolForm';
import { EditSpoolForm } from '../Components/spools/EditSpoolForm';

type Spool = components["schemas"]["SpoolDto"];
type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

export const CreateSpool = async (spool: CreateSpoolDto): Promise<Spool> => {
    const response = await fetch("https://localhost:7035/spool", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spool)
    });

    if (!response.ok) {
        throw new Error("Failed to create spool");
    }
    return await response.json() as Spool;
}

export default function GetSpools() {
    const [spools, setSpools] = useState<Spool[]>([]);
    const [editingSpool, setEditingSpool] = useState<Spool | null>(null);

    useEffect(() => {
        const loadSpools = async () => {
            try {
                const response = await fetch("https://localhost:7035/spool");
                if (!response.ok) throw new Error("Failed to fetch API");
                const data: Spool[] = await response.json();
                setSpools(data);
                console.log(data);
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
            const response = await fetch(`https://localhost:7035/spool/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });
            if (!response.ok) throw new Error("Failed to update spool");
            const updatedSpool: Spool = await response.json();
            setSpools(prev => prev.map(s => s.id === id ? updatedSpool : s));
            setEditingSpool(null);
        } catch (error) {
            console.error("Error updating spool", error);
        }
    }

    const handleDeleteSpool = async (id: number | string) => {
        try {
            const response = await fetch(`https://localhost:7035/spool/${id}`, {
            method: "DELETE"
            });
        if (!response.ok) throw new Error("Failed to delete spool");
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
                        <th>User Id</th>
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
                        <td>{s.userId}</td>
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
