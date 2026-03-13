import { useState, useEffect } from 'react';
import type { components } from "../types/schema";

type Spool = components["schemas"]["Spool"];

export default function CreateSpool() {
    const [spools, setSpools] = useState<Spool[]>([]);

    useEffect(() => {
        const loadSpools = async () => {
            try { const response = await fetch("https://localhost:7035/spool");
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


    return (
        <div>
            <h1>Create Spool</h1>
            <p>This is the page to create a new spool.</p>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Color</th>
                        <th>Total Weight</th>
                        <th>Created</th>
                        <th>User Id</th>
                    </tr>
                </thead>

                <tbody>
                    {spools.map(s => (
                    <tr key={s.id}>
                        <td>{s.material}</td>
                        <td>{s.color}</td>
                        <td>{s.totalWeight}</td>
                        <td>{s.createdAt}</td>
                        <td>{s.userId}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <form>
                <label>
                    Spool Name:
                    <input type="text" name="name" />
                </label>
                <br />
                <label>
                    Total Weight:
                    <input type="number" name="totalWeight" />
                </label>
                <br />
                <button type="submit">Create Spool</button>
            </form>
        </div>
    )
}