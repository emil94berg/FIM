import { Button } from "../components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../components/spools/AddSpoolForm';
import { EditSpoolForm } from '../components/spools/EditSpoolForm';
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

    const getRemainingWeightValue = (spool: Spool) => Number(spool.remainingWeight);

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
            <Table border={1}>
                <TableHeader>
                    <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Diameter</TableHead>
                        <TableHead>Total Weight</TableHead>
                        <TableHead>Remaining Weight</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {spools.map(s => (
                        <TableRow key={s.id}>
                            <TableCell>{s.brand}</TableCell>
                            <TableCell>{s.material}</TableCell>
                            <TableCell>{s.colorName}</TableCell>
                            <TableCell>{s.diameter}</TableCell>
                            <TableCell>{s.totalWeight}</TableCell>
                            <TableCell>
                                {getRemainingWeightValue(s) < 0 ? (
                                    <span className="font-semibold text-red-600">
                                        {s.remainingWeight} (Warning: Negative)
                                    </span>
                                ) : (
                                    s.remainingWeight
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(s.createdAt).toLocaleString("sv-SE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </TableCell>
                            <TableCell>
                                <Button className="bg-blue-500 text-black" onClick={() => setEditingSpool(s)}>Edit</Button>
                                <Button className="bg-red-500 text-white" onClick={() => handleDeleteSpool(s.id!)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
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
