import { useState, useEffect } from "react"
import type { components } from "src/types/schema"
import { authFetch } from "../auth/authFetch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CancelPrint } from "@/components/popUp/CancelPrintPopup"

type Prints = components["schemas"]["PrintDto"];

export default function EditActivePrints() {
    const [activePrints, setActivePrints] = useState<Prints[]>([]);


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

    const UpdateGramsUsed = async (print: Prints, grams:number) => {
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

    const progressBarWidth = (print: Prints) => {
        if (!print.estimatedEndTime) return 0;


        const createdAt = parseDate(print.createdAt);
        const estimatedEnd = parseDate(print.estimatedEndTime);
        const now = new Date();

        const fullTime = estimatedEnd.getTime() - createdAt.getTime();
        if (fullTime <= 0) return 100;

        const elapsedTime = now.getTime() - createdAt.getTime();
        const percentage = (elapsedTime / fullTime) * 100;

        console.log(createdAt, estimatedEnd);

        return Math.round(Math.min(Math.max(percentage, 0), 100));
    }

    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed",
        4: "Cancelled"
    }
   
    return (
        <div>
        <h1>Active Prints</h1>
            <Table border={1}>
                <TableHeader>
                <TableRow>
                    
                        <TableHead>Print Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Progress bar</TableHead>
                 
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {activePrints.map(p => (
                            <TableRow>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{statusMap[p.status]}</TableCell>
                                <TableCell>
                                    <CancelPrint onConfirm={(grams: number) => UpdateGramsUsed(p, grams)}></CancelPrint>
                                </TableCell>
                                <TableCell style={{ backgroundColor: "lightgreen", width: progressBarWidth(p) }}>{progressBarWidth(p)}%</TableCell>
                            </TableRow>        
                        ))}
                </TableBody>
            </Table>
        </div>
    )
}

