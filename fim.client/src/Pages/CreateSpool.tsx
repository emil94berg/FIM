import { useState, useEffect } from 'react';
import type { components } from "../types/schema";
import { AddSpoolForm } from '../Components/spools/AddSpoolForm';

type Spool = components["schemas"]["Spool"];

export const createSpool = async (spool: Spool): Promise<Spool> => {
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

export default function CreateSpool() {
    const [spools, setSpools] = useState<Spool[]>([]);

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

    const handleCreateSpool = async (spool: Spool) => {
        const newSpool = await createSpool(spool);
        setSpools(prev => [...prev, newSpool]);
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
                        <th>Total Weight</th>
                        <th>Remaining Weight</th>
                        <th>Created</th>
                        <th>User Id</th>
                    </tr>
                </thead>

                <tbody>
                    {spools.map(s => (
                    <tr key={s.id}>
                        <td>{s.brand}</td>
                        <td>{s.material}</td>
                        <td>{s.color}</td>
                        <td>{s.totalWeight}</td>
                        <td>{s.remainingWeight}</td>
                        <td>{s.createdAt}</td>
                        <td>{s.userId}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <AddSpoolForm onSubmit={handleCreateSpool} />
        </div>
    )
}
