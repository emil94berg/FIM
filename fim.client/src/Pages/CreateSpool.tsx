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
            <div>
                 {spools.map(s => <div key={s.id}>{s.totalWeight}</div>)}
            </div>
        </div>
    )
}