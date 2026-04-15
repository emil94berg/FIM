

import { useState, useEffect, useCallback } from "react"
import type { components } from "src/types/schema"
import { authFetch } from "../auth/authFetch"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UpdatePercentageBar } from "@/components/notifications/PrintTableRow";


type Print = components["schemas"]["PrintDto"];

export default function EditActivePrints() {
    const [activePrints, setActivePrints] = useState<Print[]>([]);
    

    

    const UpdateGramsUsed = async (print: Print, grams:number) => {
        try {
            await authFetch(`https://localhost:7035/Spool/UpdateSpoolWeight`, {
            method: "POST",
                body: JSON.stringify({
                    GramsUsed: grams,
                    SpoolId: print.spoolId
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const updatedPrint = await authFetch(`https://localhost:7035/Print/CancelPrint`, {
                method: "POST",
                body: JSON.stringify(print),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setActivePrints(prev => prev.filter(p => p.id !== updatedPrint.id));
        }
        catch (error) {
            console.log("Failed to fetch from Spools " + error);
        }
    };

    const parseDate = (dateStr: string) => {
        return new Date(
            dateStr
                .replace(" ", "T") + "Z"
                .replace(/\.(\d{3})\d+/, ".$1")
        )
    }

   
    
    const progressBarWidth = useCallback((print: Print) => {
        if (!print.estimatedEndTime) return 0;

        const startedAt = parseDate(print.startedAt !== null ? print.startedAt : "could not fetch data");
        const estimatedEnd = parseDate(print.estimatedEndTime);
        const now = new Date();

        const fullTime = estimatedEnd.getTime() - startedAt.getTime();
        if (fullTime <= 0) return 100;

        const elapsedTime = now.getTime() - startedAt.getTime();
        const percentage = (elapsedTime / fullTime) * 100;

        return (Math.round(Math.min(Math.max(percentage, 0), 100)))
    }, [])

    const shortDate = (date: Date) => {
        const newDate = date.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        })
        return newDate;
    }

 
    useEffect(() => {
        const interval = setInterval(() => {
            setActivePrints(prev => [...prev]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    

    
    useEffect(() => {
        const loadActivePrints = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/Print/GetActivePrints`);
                setActivePrints(data);
            }
            catch (error) {
                console.log("Failed to fetch from Prints: " + error);
            }
        }
        loadActivePrints();
    }, []);
   
    return (
        <div>
        <h1>Active Prints</h1>
            <Table border={1}>
                <TableHeader>
                <TableRow>
                        <TableHead>Print Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress bar</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {activePrints.map(p => (
                            <UpdatePercentageBar
                                print={p}
                                shortDate={shortDate}
                                parseDate={parseDate}
                                UpdateGramsUsed={UpdateGramsUsed}
                                progressBarWidth={progressBarWidth}
                            ></UpdatePercentageBar> 
                        ))}
                </TableBody>
            </Table>
        </div>
    ) 
}

